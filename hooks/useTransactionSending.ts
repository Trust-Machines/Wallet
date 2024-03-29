import { bitcoinToSatoshiInteger, safeParseFloat } from '@utils/helpers';
import { HDSegwitBech32Wallet } from '@utils/wallets';
const ElectrumHelper = require('@utils/ElectrumHelper');
const bitcoin = require('bitcoinjs-lib');

export type TransactionDetails = {
  transactionId: string;
  fee: number;
};

interface TransactionResult {
  success: boolean;
  data?: TransactionDetails;
}

export default async function useTransactionSending(
  transaction: { address: string; amount: string; selectedFee?: 'slow' | 'medium' | 'fast' },
  wallet: any
): Promise<TransactionResult> {
  const broadcast = async (tx: number) => {
    await ElectrumHelper.ping();
    await ElectrumHelper.waitTillConnected();
    const result = await wallet.broadcastTx(tx);
    if (!result) {
      console.log(`Error! Couldn't broadcast transaction`);
    }
    return result;
  };

  const handleTransactionSending = async () => {
    return new Promise(async resolve => {
      try {
        await wallet.fetchBalance();
        console.log('wallet balance', wallet.getBalance());

        await wallet.fetchTransactions();
        console.log('wallet transactions', wallet.getTransactions());

        const fees = await ElectrumHelper.estimateFees();
        console.log('fast tx fee', fees.fast);

        let selectedFeeAmount = transaction.selectedFee === 'medium' ? fees.medium : transaction.selectedFee === 'slow' ? fees.slow : fees.fast

        const changeAddress = await wallet.getChangeAddressAsync();
        console.log('changeAddress', changeAddress);

        console.log('utxo', wallet.getUtxo());

        const amountToSendInSats = bitcoinToSatoshiInteger(safeParseFloat(transaction.amount));

        const { tx, outputs, psbt, fee } = wallet.createTransaction(
          wallet.getUtxo(),
          [{ address: transaction.address, value: amountToSendInSats }],
          selectedFeeAmount,
          changeAddress,
          HDSegwitBech32Wallet.defaultRBFSequence
        );

        await broadcast(tx.toHex());
        const transactionId = bitcoin.Transaction.fromHex(tx.toHex()).getId();
        console.log('Transaction ID on btc network: ', transactionId);

        if (!!transactionId) {
          console.log('transaction success');
          resolve({ success: true, data: { transactionId, fee: fees.fast } });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log('broadcast failed', e);
        return resolve({ success: false });
      }
    });
  };

  return (await handleTransactionSending()) as TransactionResult;
}
