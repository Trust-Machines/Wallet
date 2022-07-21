import wif from 'wif';
import bip38 from 'bip38';

import {
  HDAezeedWallet,
  HDLegacyBreadwalletWallet,
  HDLegacyElectrumSeedP2PKHWallet,
  HDLegacyP2PKHWallet,
  HDSegwitBech32Wallet,
  HDSegwitElectrumSeedP2WPKHWallet,
  HDSegwitP2SHWallet,
  LegacyWallet,
  LightningCustodianWallet,
  LightningLdkWallet,
  MultisigHDWallet,
  SLIP39LegacyP2PKHWallet,
  SLIP39SegwitBech32Wallet,
  SLIP39SegwitP2SHWallet,
  SegwitBech32Wallet,
  SegwitP2SHWallet,
  WatchOnlyWallet,
} from '.';
import bip39WalletFormats from './bip39_wallet_formats.json'; // https://github.com/spesmilo/electrum/blob/master/electrum/bip39_wallet_formats.json

// https://github.com/bitcoinjs/bip32/blob/master/ts-src/bip32.ts#L43
export const validateBip32 = path => path.match(/^(m\/)?(\d+'?\/)*\d+'?$/) !== null;

/**
 * Function that starts wallet search and import process. It has async generator inside, so
 * that the process can be stoped at any time. It reporst all the progress through callbacks.
 *
 * @param askPassphrase {bool} If true import process will call onPassword callback for wallet with optional password.
 * @param searchAccounts {bool} If true import process will scan for all known derivation path from bip39_wallet_formats.json. If false it will use limited version.
 * @param onProgress {function} Callback to report scanning progress
 * @param onWallet {function} Callback to report wallet found
 * @param onPassword {function} Callback to ask for password if needed
 * @returns {{promise: Promise, stop: function}}
 */
export const startImport = (
  importTextOrig,
  type,
  askPassphrase = false,
  searchAccounts = false,
  onProgress,
  onWallet,
  onPassword
) => {
  // actions
  const reportProgress = name => {
    onProgress(name);
  };
  const reportWallet = (wallet) => {
    onWallet(wallet);
  };

  let text = importTextOrig.trim();
  let password;

  // BIP38 password required
  if (text.startsWith("6P")) {
    do {
      password = onPassword();
    } while (!password);
  }

  const getMultisigWallet = async () => {
    reportProgress("multisignature");
    const ms = new MultisigHDWallet();
    ms.setSecret(text);
    if (ms.getN() > 0 && ms.getM() > 0) {
      await ms.fetchBalance();
      reportWallet(ms);
    }
  };

  const getLightningCustodianWallet = async () => {
    onProgress("lightning custodian");
    if (text.startsWith("blitzhub://") || text.startsWith("lndhub://")) {
      const lnd = new LightningCustodianWallet();
      if (text.includes('@')) {
        const split = text.split('@');
        lnd.setBaseURI(split[1]);
        lnd.setSecret(split[0]);
      }
      await lnd.init();
      await lnd.authorize();
      await lnd.fetchTransactions();
      await lnd.fetchUserInvoices();
      await lnd.fetchPendingTransactions();
      await lnd.fetchBalance();
      onWallet(lnd);
    }
  };

  const getLightningWallet = async () => {
    onProgress("lightning");
    if (text.startsWith("ldk://")) {
      const ldk = new LightningLdkWallet();
      ldk.setSecret(text);
      if (ldk.valid()) {
        await ldk.init();
        onWallet(ldk);
      }
    }
  };

  //   check bip39 wallets
  const getBip39Wallet = async () => {
    reportProgress("bip39");
    const hd2 = new HDSegwitBech32Wallet();
    hd2.setSecret(text);
    hd2.setPassphrase(password);
    if (hd2.validateMnemonic()) {
      let walletFound = false;
      // by default we don't try all the paths and options
      const paths = bip39WalletFormats;
      for (const i of paths) {
        // we need to skip m/0' p2pkh from default scan list. It could be a BRD wallet and will be handled later
        if (i.derivation_path === "m/0'" && i.script_type === 'p2pkh') continue;
        let paths;
        if (i.iterate_accounts && searchAccounts) {
          const basicPath = i.derivation_path.slice(0, -2); // remove 0' from the end
          paths = [...Array(10).keys()].map(j => basicPath + j + "'"); // add account number
        } else {
          paths = [i.derivation_path];
        }
        let WalletClass;
        switch (i.script_type) {
          case 'p2pkh':
            WalletClass = HDLegacyP2PKHWallet;
            break;
          case 'p2wpkh-p2sh':
            WalletClass = HDSegwitP2SHWallet;
            break;
          default:
            // p2wpkh
            WalletClass = HDSegwitBech32Wallet;
        }
        for (const path of paths) {
          const wallet = new WalletClass();
          wallet.setSecret(text);
          wallet.setPassphrase(password);
          wallet.setDerivationPath(path);
          reportProgress(`bip39 ${i.script_type} ${path}`);
          if (await wallet.wasEverUsed()) {
            reportWallet(wallet);
            walletFound = true;
          } else {
            break; // don't check second account if first one is empty
          }
        }
      }

      // m/0' p2pkh is a special case. It could be regular a HD wallet or a BRD wallet.
      // to decide which one is it let's compare number of transactions
      const m0Legacy = new HDLegacyP2PKHWallet();
      m0Legacy.setSecret(text);
      m0Legacy.setPassphrase(password);
      m0Legacy.setDerivationPath("m/0'");
      reportProgress("bip39 p2pkh m/0'");
      // BRD doesn't support passphrase and only works with 12 words seeds
      if (!password && text.split(' ').length === 12) {
        const brd = new HDLegacyBreadwalletWallet();
        brd.setSecret(text);

        if (await m0Legacy.wasEverUsed()) {
          await m0Legacy.fetchBalance();
          await m0Legacy.fetchTransactions();
          reportProgress("BRD");
          await brd.fetchBalance();
          await brd.fetchTransactions();
          if (
            brd.getTransactions().length > m0Legacy.getTransactions().length
          ) {
            reportWallet(brd);
          } else {
            reportWallet(m0Legacy);
          }
          walletFound = true;
        }
      } else {
        if (await m0Legacy.wasEverUsed()) {
          reportWallet(m0Legacy);
          walletFound = true;
        }
      }

      // if we havent found any wallet for this seed suggest new bech32 wallet
      if (!walletFound) {
        reportWallet(hd2);
      }
    }
  };

  const getWifWallet = async () => {
    onProgress("wif");
    const segwitWallet = new SegwitP2SHWallet();
    segwitWallet.setSecret(text);
    if (segwitWallet.getAddress()) {
      // ok its a valid WIF
      let walletFound = false;

      onProgress("wif p2wpkh");
      const segwitBech32Wallet = new SegwitBech32Wallet();
      segwitBech32Wallet.setSecret(text);
      if (await segwitBech32Wallet.wasEverUsed()) {
        // yep, its single-address bech32 wallet
        await segwitBech32Wallet.fetchBalance();
        walletFound = true;
        onWallet(segwitBech32Wallet);
      }

      onProgress("wif p2wpkh-p2sh");
      if (await segwitWallet.wasEverUsed()) {
        // yep, its single-address p2wpkh wallet
        await segwitWallet.fetchBalance();
        walletFound = true;
        onWallet(segwitWallet);
      }

      // default wallet is Legacy
      onProgress("wif p2pkh");
      const legacyWallet = new LegacyWallet();
      legacyWallet.setSecret(text);
      if (await legacyWallet.wasEverUsed()) {
        // yep, its single-address legacy wallet
        await legacyWallet.fetchBalance();
        walletFound = true;
        onWallet(legacyWallet);
      }

      // if no wallets was ever used, import all of them
      if (!walletFound) {
        onWallet(segwitBech32Wallet);
        onWallet(segwitWallet);
        onWallet(legacyWallet);
      }
    }
  };

  // case - WIF is valid, just has uncompressed pubkey
  const getWifP2pkhWallet = async () => {
    onProgress("wif p2pkh");
    const legacyWallet = new LegacyWallet();
    legacyWallet.setSecret(text);
    if (legacyWallet.getAddress()) {
      await legacyWallet.fetchBalance();
      await legacyWallet.fetchTransactions();
      onWallet(legacyWallet);
    }
  };

  // maybe its a watch-only address?
  const getWatchOnlyWallet = async () => {
    onProgress("watch only");
    const watchOnly = new WatchOnlyWallet();
    watchOnly.setSecret(text);
    if (watchOnly.valid()) {
      await watchOnly.fetchBalance();
      onWallet(watchOnly);
    }
  };

  // electrum p2wpkh-p2sh
  const getElectrumP2wpkhP2shWallet = async () => {
    onProgress("electrum p2wpkh-p2sh");
    const el1 = new HDSegwitElectrumSeedP2WPKHWallet();
    el1.setSecret(text);
    el1.setPassphrase(password);
    if (el1.validateMnemonic()) {
      onWallet(el1); // not fetching txs or balances, fuck it, yolo, life is too short
    }
  };

  // electrum p2pkh
  const getElectrumP2pkhWallet = async () => {
    onProgress("electrum p2pkh");
    const el2 = new HDLegacyElectrumSeedP2PKHWallet();
    el2.setSecret(text);
    el2.setPassphrase(password);
    if (el2.validateMnemonic()) {
      onWallet(el2); // not fetching txs or balances, fuck it, yolo, life is too short
    }
  };

  // is it AEZEED?
  const getAezeedWallet = async () => {
    onProgress("aezeed");
    const aezeed2 = new HDAezeedWallet();
    aezeed2.setSecret(text);
    aezeed2.setPassphrase(password);
    if (await aezeed2.validateMnemonicAsync()) {
      onWallet(aezeed2); // not fetching txs or balances, fuck it, yolo, life is too short
    }
  };

  // if it is multi-line string, then it is probably SLIP39 wallet
  // each line - one share
  const getSlip39Wallet = async () => {
    onProgress("SLIP39");
    if (text.includes("\n")) {
      const s1 = new SLIP39SegwitP2SHWallet();
      s1.setSecret(text);

      if (s1.validateMnemonic()) {
        onProgress("SLIP39 p2wpkh-p2sh");
        s1.setPassphrase(password);
        if (await s1.wasEverUsed()) {
          onWallet(s1);
        }

        onProgress("SLIP39 p2pkh");
        const s2 = new SLIP39LegacyP2PKHWallet();
        s2.setPassphrase(password);
        s2.setSecret(text);
        if (await s2.wasEverUsed()) {
          onWallet(s2);
        }

        onProgress("SLIP39 p2wpkh");
        const s3 = new SLIP39SegwitBech32Wallet();
        s3.setSecret(text);
        s3.setPassphrase(password);
        onWallet(s3);
      }
    }
  };

  // Use if/else for performance instead of switch case
  if (type === "multisignature") {
    getMultisigWallet();
  } else if (type == "lightning custodian") {
    getLightningCustodianWallet();
  } else if (type == "lightning") {
    getLightningWallet();
  } else if (type === "bip39") {
    getBip39Wallet();
  } else if (type === "wif") {
    getWifWallet();
  } else if (type === "wif p2pkh") {
    getWifP2pkhWallet();
  } else if (type === "watch only") {
    getWatchOnlyWallet();
  } else if (type === "electrum p2wpkh-p2sh") {
    getElectrumP2wpkhP2shWallet();
  } else if (type === "electrum p2pkh") {
    getElectrumP2pkhWallet();
  } else if (type === "aezeed") {
    getAezeedWallet();
  } else if (type === "SLIP39") {
    getSlip39Wallet();
  } else {
    // Call all wallets simultaneously
    getMultisigWallet();
    getLightningCustodianWallet();
    getLightningWallet();
    getBip39Wallet();
    getWifWallet();
    getWifP2pkhWallet();
    getWatchOnlyWallet();
    getElectrumP2wpkhP2shWallet();
    getElectrumP2pkhWallet();
    getAezeedWallet();
    getSlip39Wallet();
  }

  return;
};

// Note:
// /**
//    * Loads from storage all wallets and
//    * maps them to `wallets`
//    *
//    * @param password If present means storage must be decrypted before usage
//    * @returns {Promise.<boolean>}
//    */
//  async loadFromDisk(password) {
//   let data = await this.getItemWithFallbackToRealm('data');
//   if (password) {
//     data = this.decryptData(data, password);
//     if (data) {
//       // password is good, cache it
//       this.cachedPassword = password;
//     }
//   }
//   if (data !== null) {
//     let realm;
//     try {
//       realm = await this.getRealm();
//     } catch (error) {
//       alert(error.message);
//     }
//     data = JSON.parse(data);
//     if (!data.wallets) return false;
//     const wallets = data.wallets;
//     for (const key of wallets) {
//       // deciding which type is wallet and instatiating correct object
//       const tempObj = JSON.parse(key);
//       let unserializedWallet;
//       switch (tempObj.type) {
//         case SegwitBech32Wallet.type:
//           unserializedWallet = SegwitBech32Wallet.fromJson(key);
//           break;
//         case SegwitP2SHWallet.type:
//           unserializedWallet = SegwitP2SHWallet.fromJson(key);
//           break;
//         case WatchOnlyWallet.type:
//           unserializedWallet = WatchOnlyWallet.fromJson(key);
//           unserializedWallet.init();
//           if (unserializedWallet.isHd() && !unserializedWallet.isXpubValid()) {
//             continue;
//           }
//           break;
//         case HDLegacyP2PKHWallet.type:
//           unserializedWallet = HDLegacyP2PKHWallet.fromJson(key);
//           break;
//         case HDSegwitP2SHWallet.type:
//           unserializedWallet = HDSegwitP2SHWallet.fromJson(key);
//           break;
//         case HDSegwitBech32Wallet.type:
//           unserializedWallet = HDSegwitBech32Wallet.fromJson(key);
//           break;
//         case HDLegacyBreadwalletWallet.type:
//           unserializedWallet = HDLegacyBreadwalletWallet.fromJson(key);
//           break;
//         case HDLegacyElectrumSeedP2PKHWallet.type:
//           unserializedWallet = HDLegacyElectrumSeedP2PKHWallet.fromJson(key);
//           break;
//         case HDSegwitElectrumSeedP2WPKHWallet.type:
//           unserializedWallet = HDSegwitElectrumSeedP2WPKHWallet.fromJson(key);
//           break;
//         case MultisigHDWallet.type:
//           unserializedWallet = MultisigHDWallet.fromJson(key);
//           break;
//         case HDAezeedWallet.type:
//           unserializedWallet = HDAezeedWallet.fromJson(key);
//           // migrate password to this.passphrase field
//           if (unserializedWallet.secret.includes(':')) {
//             const [mnemonic, passphrase] = unserializedWallet.secret.split(':');
//             unserializedWallet.secret = mnemonic;
//             unserializedWallet.passphrase = passphrase;
//           }

//           break;
//         case LightningLdkWallet.type:
//           unserializedWallet = LightningLdkWallet.fromJson(key);
//           break;
//         case SLIP39SegwitP2SHWallet.type:
//           unserializedWallet = SLIP39SegwitP2SHWallet.fromJson(key);
//           break;
//         case SLIP39LegacyP2PKHWallet.type:
//           unserializedWallet = SLIP39LegacyP2PKHWallet.fromJson(key);
//           break;
//         case SLIP39SegwitBech32Wallet.type:
//           unserializedWallet = SLIP39SegwitBech32Wallet.fromJson(key);
//           break;
//         case LightningCustodianWallet.type: {
//           /** @type {LightningCustodianWallet} */
//           unserializedWallet = LightningCustodianWallet.fromJson(key);
//           let lndhub = false;
//           try {
//             lndhub = await AsyncStorage.getItem(AppStorage.LNDHUB);
//           } catch (Error) {
//             console.warn(Error);
//           }

//           if (unserializedWallet.baseURI) {
//             unserializedWallet.setBaseURI(unserializedWallet.baseURI); // not really necessary, just for the sake of readability
//             console.log('using saved uri for for ln wallet:', unserializedWallet.baseURI);
//           } else if (lndhub) {
//             console.log('using wallet-wide settings ', lndhub, 'for ln wallet');
//             unserializedWallet.setBaseURI(lndhub);
//           } else {
//             console.log('wallet does not have a baseURI. Continuing init...');
//           }
//           unserializedWallet.init();
//           break;
//         }
//         case LegacyWallet.type:
//         default:
//           unserializedWallet = LegacyWallet.fromJson(key);
//           break;
//       }

//       try {
//         if (realm) this.inflateWalletFromRealm(realm, unserializedWallet);
//       } catch (error) {
//         alert(error.message);
//       }

//       // done
//       const ID = unserializedWallet.getID();
//       if (!this.wallets.some(wallet => wallet.getID() === ID)) {
//         this.wallets.push(unserializedWallet);
//         this.tx_metadata = data.tx_metadata;
//       }
//     }
//     if (realm) realm.close();
//     return true;
//   } else {
//     return false; // failed loading data or loading/decryptin data
//   }
// }
