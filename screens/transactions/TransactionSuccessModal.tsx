import { QrStackScreenProps } from "../../types";
import { en } from "../../en";
import { TransactionSuccess } from "./components/TransactionSuccess";

export function TransactionSuccessModal({
  route,
}: QrStackScreenProps<"TransactionSuccess">) {
  return (
    <TransactionSuccess
      transactionDetails={route.params}
      title={en.Qr_flow_transaction_success_title}
    />
  );
}
