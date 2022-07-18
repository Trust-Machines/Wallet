import { SendStackScreenProps } from '../../types';
import { en } from '../../en';
import { TransactionSuccess } from './components/TransactionSuccess';

export function SendSuccessModal({ route }: SendStackScreenProps<'SendSuccess'>) {
  return (
    <TransactionSuccess
      title={en.Qr_flow_transaction_success_title}
      transactionDetails={route.params}
    />
  );
}
