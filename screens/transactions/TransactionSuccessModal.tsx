import { TransactionStackScreenProps } from '../../navigation/nav-types';
import { en } from '../../en';
import { TransactionSuccess } from './components/TransactionSuccess';

export function TransactionSuccessModal({
  route,
}: TransactionStackScreenProps<'TransactionSuccess'>) {
  return (
    <TransactionSuccess
      transactionDetails={route.params}
      title={en.Qr_flow_transaction_success_title}
    />
  );
}
