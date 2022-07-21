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
  onPassword,
  onNotFound
) => {
  // actions
  const reportProgress = name => {
    onProgress(name);
  };
  const reportWallet = wallet => {
    onWallet(wallet);
  };
  const reportNotFound = () => {
    onNotFound();
  };

  let text = importTextOrig.trim();
  let password = '123456';

  // BIP38 password required
  if (text.startsWith('6P')) {
    do {
      password = onPassword();
    } while (!password);
  }

  const getMultisigWallet = async () => {
    reportProgress('multisignature');
    const ms = new MultisigHDWallet();
    ms.setSecret(text);
    if (ms.getN() > 0 && ms.getM() > 0) {
      await ms.fetchBalance();
      reportWallet(ms);
    }
  };

  const getLightningCustodianWallet = async () => {
    reportProgress('lightning custodian');
    if (text.startsWith('blitzhub://') || text.startsWith('lndhub://')) {
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
      reportWallet(lnd);
    }
  };

  const getLightningWallet = async () => {
    reportProgress('lightning');
    if (text.startsWith('ldk://')) {
      const ldk = new LightningLdkWallet();
      ldk.setSecret(text);
      if (ldk.valid()) {
        await ldk.init();
        reportWallet(ldk);
      }
    }
  };

  //   check bip39 wallets
  const getBip39Wallet = async type => {
    if (type && type !== "bip39 p2pkh m/0'" && type !== 'BRD') {
      let wallet;
      if (type.startsWith('bip p2pkh')) {
        wallet = new HDLegacyP2PKHWallet();
      } else if (type.startsWith('bip p2wpkh-p2sh')) {
        wallet = new HDSegwitP2SHWallet();
      } else {
        wallet = new HDSegwitBech32Wallet();
      }
      wallet.setSecret(text);
      wallet.setPassphrase(password);
      wallet.setDerivationPath(type.split(' ')[type.split(' ').length - 1]);
      reportProgress(type);
      reportWallet(wallet);
      return;
    }

    if (type === "bip39 p2pkh m/0'") {
      const m0Legacy = new HDLegacyP2PKHWallet();
      m0Legacy.setSecret(text);
      m0Legacy.setPassphrase(password);
      m0Legacy.setDerivationPath("m/0'");
      await m0Legacy.fetchBalance();
      await m0Legacy.fetchTransactions();
      reportProgress(type);
      reportWallet(m0Legacy);
      return;
    }

    if (type === 'BRD') {
      const brd = new HDLegacyBreadwalletWallet();
      brd.setSecret(text);
      await brd.fetchBalance();
      await brd.fetchTransactions();
      reportProgress(type);
      reportWallet(brd);
      return;
    }

    const hd2 = new HDSegwitBech32Wallet();
    hd2.setSecret(text);
    hd2.setPassphrase(password);

    if (hd2.validateMnemonic()) {
      let walletFound = false;
      // by default we don't try all the paths and options
      const paths = bip39WalletFormats;
      const walletTypes = paths.map(walletType => {
        return `bip39 ${walletType.script_type} ${walletType.derivation_path}`;
      });

      if (!type || (walletTypes.includes(type) && type !== "bip39 p2pkh m/0'" && type !== 'BRD')) {
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
            if (!type || type === `bip39 ${i.script_type} ${path}`) {
              const wallet = new WalletClass();
              wallet.setSecret(text);
              wallet.setPassphrase(password);
              wallet.setDerivationPath(path);
              reportProgress(`bip39 ${i.script_type} ${path}`);
              if (await wallet.wasEverUsed()) {
                // if no pw given, it reports it true. with pw, false is reported
                reportWallet(wallet);
                walletFound = true;
              } else {
                break; // don't check second account if first one is empty
              }
            }
          }
        }

        // m/0' p2pkh is a special case. It could be regular a HD wallet or a BRD wallet.
        // to decide which one is it let's compare number of transactions
        if (!type || type === "bip39 p2pkh m/0'" || type === 'BRD') {
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
              reportProgress('BRD');
              await brd.fetchBalance();
              await brd.fetchTransactions();
              if (brd.getTransactions().length > m0Legacy.getTransactions().length) {
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
        }

        // if we havent found any wallet for this seed suggest new bech32 wallet
        if (!walletFound) {
          reportWallet(hd2);
        }
      }
    }
  };

  // check wif wallets
  const getWifWallet = async type => {
    reportProgress('wif');

    // case - Legacy wallet or WIF is valid, just has uncompressed pubkey
    if (!type || type === 'wif p2pkh') {
      reportProgress('wif p2pkh');
      const legacyWallet = new LegacyWallet();
      legacyWallet.setSecret(text);
      if (legacyWallet.getAddress()) {
        await legacyWallet.fetchBalance();
        await legacyWallet.fetchTransactions();
        reportWallet(legacyWallet);
        return;
      }
      if (await legacyWallet.wasEverUsed()) {
        // yep, its single-address legacy wallet
        await legacyWallet.fetchBalance();
        walletFound = true;
        reportWallet(legacyWallet);
        return;
      }
    }

    // check non-legacy wif wallets
    const segwitWallet = new SegwitP2SHWallet();
    segwitWallet.setSecret(text);
    if (segwitWallet.getAddress()) {
      // ok its a valid WIF
      let walletFound = false;

      if (!type || type === 'wif p2wpkh') {
        reportProgress('wif p2wpkh');
        const segwitBech32Wallet = new SegwitBech32Wallet();
        segwitBech32Wallet.setSecret(text);
        if (await segwitBech32Wallet.wasEverUsed()) {
          // yep, its single-address bech32 wallet
          await segwitBech32Wallet.fetchBalance();
          walletFound = true;
          reportWallet(segwitBech32Wallet);
          return;
        }
      }

      if (!type || type === 'wif p2wpkh-p2sh') {
        reportProgress('wif p2wpkh-p2sh');
        if (await segwitWallet.wasEverUsed()) {
          // yep, its single-address p2wpkh wallet
          await segwitWallet.fetchBalance();
          walletFound = true;
          reportWallet(segwitWallet);
          return;
        }
      }
    }
  };

  // maybe its a watch-only address?
  const getWatchOnlyWallet = async () => {
    reportProgress('watch only');
    const watchOnly = new WatchOnlyWallet();
    watchOnly.setSecret(text);
    if (watchOnly.valid()) {
      await watchOnly.fetchBalance();
      reportWallet(watchOnly);
    }
  };

  // electrum
  const getElectrumWallet = async type => {
    if (!type || type === 'electrum p2wpkh-p2sh') {
      reportProgress('electrum p2wpkh-p2sh');
      const el1 = new HDSegwitElectrumSeedP2WPKHWallet();
      el1.setSecret(text);
      el1.setPassphrase(password);
      if (el1.validateMnemonic()) {
        reportWallet(el1); // not fetching txs or balances, fuck it, yolo, life is too short
      }
    }
    if (!type || type === 'electrum p2pkh') {
      reportProgress('electrum p2pkh');
      const el2 = new HDLegacyElectrumSeedP2PKHWallet();
      el2.setSecret(text);
      el2.setPassphrase(password);
      if (el2.validateMnemonic()) {
        reportWallet(el2); // not fetching txs or balances, fuck it, yolo, life is too short
      }
    }
  };

  // is it AEZEED?
  const getAezeedWallet = async () => {
    reportProgress('aezeed');
    const aezeed2 = new HDAezeedWallet();
    aezeed2.setSecret(text);
    aezeed2.setPassphrase(password);
    if (await aezeed2.validateMnemonicAsync()) {
      reportWallet(aezeed2); // not fetching txs or balances, fuck it, yolo, life is too short
    }
  };

  // if it is multi-line string, then it is probably SLIP39 wallet
  // each line - one share
  const getSlip39Wallet = async type => {
    reportProgress('SLIP39');
    if (text.includes('\n')) {
      const s1 = new SLIP39SegwitP2SHWallet();
      s1.setSecret(text);

      if (s1.validateMnemonic()) {
        if (!type || type === 'SLIP39 p2wpkh-p2sh') {
          reportProgress('SLIP39 p2wpkh-p2sh');
          s1.setPassphrase(password);
          if (await s1.wasEverUsed()) {
            reportWallet(s1);
          }
        }

        if (!type || type === 'SLIP39 p2pkh') {
          reportProgress('SLIP39 p2pkh');
          const s2 = new SLIP39LegacyP2PKHWallet();
          s2.setPassphrase(password);
          s2.setSecret(text);
          if (await s2.wasEverUsed()) {
            reportWallet(s2);
          }
        }

        if (!type || type === 'SLIP39 p2wpkh') {
          reportProgress('SLIP39 p2wpkh');
          const s3 = new SLIP39SegwitBech32Wallet();
          s3.setSecret(text);
          s3.setPassphrase(password);
          reportWallet(s3);
        }
      }
    }
  };

  // Use if/else for performance instead of switch case
  const importWallets = async () => {
    if (!type || type === 'multisignature') {
      await getMultisigWallet();
    }
    if (!type || type == 'lightning custodian') {
      await getLightningCustodianWallet();
    }
    if (!type || type == 'lightning') {
      await getLightningWallet();
    }
    if (!type || type?.startsWith('bip39' || type === 'BRD')) {
      await getBip39Wallet(type);
    }
    if (!type || type?.startsWith('wif')) {
      await getWifWallet();
    }
    if (!type || type === 'watch only') {
      await getWatchOnlyWallet();
    }
    if (!type || type?.startsWith('electrum')) {
      await getElectrumWallet(type);
    }
    if (!type || type === 'aezeed') {
      await getAezeedWallet();
    }
    if (!type || type?.startsWith('SLIP39')) {
      await getSlip39Wallet(type);
    }
    reportNotFound();
  };

  importWallets();

  return;
};
