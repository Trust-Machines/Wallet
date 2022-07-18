import {
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { ScreenContainer } from "../../shared/ScreenContainer";
import { RootStackScreenProps } from "../../types";
import { colors } from "../../constants/Colors";
import { styleVariables } from "../../constants/StyleVariables";
import { en } from "../../en";
import { AppButton, ButtonTheme } from "../../shared/AppButton";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect, useState } from "react";
import { satoshiToBitcoinString, timestampToDate } from "../../utils/helpers";
import { getTransactions } from "../../redux/transactionsSlice";
import { TransactionDataItem } from "./components/TransactionDataItem";

interface TransactionDataItem<T> {
  label: string;
  value: T;
}

interface TransactionObject {
  senderAddress: TransactionDataItem<string>;
  receiverAddress: TransactionDataItem<string>;
  amount: TransactionDataItem<string>;
  transactionID: TransactionDataItem<string>;
  status: TransactionDataItem<"Pending" | "Successful">;
  date: TransactionDataItem<string>;
  confirmations: TransactionDataItem<number>;
}

export function TransactionDetails({
  navigation,
  route,
}: RootStackScreenProps<"TransactionDetails">) {
  const [transaction, setTransaction] = useState<TransactionObject | undefined>(
    undefined
  );
  const { transactionHash } = route.params;
  const { transactions, transactionsLoading, transactionsError } =
    useAppSelector((state) => state.transactions);
  const { walletObject } = useAppSelector((state) => state.wallet);
  const dispatch = useAppDispatch();

  // {"blockhash": "", "blocktime": 1654680766, "confirmations": 3945, "hash": "a3a0e300ae611bbdfcdb82ecc494d994b29dbec928b7f96fb9cd605ee56d5044", "inputs": [{"addresses": [Array], "scriptSig": [Object], "sequence": 2147483648, "txid": "fdb51abf07e12642407af9594b64dd0658146fa15e3ca0c32e6f790046cefc56", "txinwitness": [Array], "value": 0.00370068, "vout": 0}], "locktime": 0, "outputs": [{"n": 0, "scriptPubKey": [Object], "value": 0.00031844}, {"n": 1, "scriptPubKey": [Object], "value": 0.00337056}], "received": 1654680766000, "size": 223, "time": 1654680766, "txid": "a3a0e300ae611bbdfcdb82ecc494d994b29dbec928b7f96fb9cd605ee56d5044", "value": 31844, "version": 2, "vsize": 141, "weight": 562}
  useEffect(() => {
    const currentTransaction = transactions.find(
      (tx: any) => tx.hash === transactionHash
    );

    let transactionObject: TransactionObject = {
      senderAddress: {
        label: "From",
        value: currentTransaction.outputs[0].scriptPubKey.addresses.join(", "),
      },
      receiverAddress: {
        label: "To",
        value: currentTransaction.inputs[0].addresses.join(", "),
      },
      amount: {
        label: "Amount",
        value: satoshiToBitcoinString(currentTransaction.value) + " BTC",
      },
      transactionID: {
        label: "Transaction ID",
        value: currentTransaction.inputs[0].txid,
      },
      status: {
        label: "Status",
        value: currentTransaction.confirmations < 2 ? "Pending" : "Successful",
      },
      date: { label: "Date", value: timestampToDate(currentTransaction.time) },
      confirmations: {
        label: "Confirmations",
        value: currentTransaction.confirmations,
      },
    };

    setTransaction(transactionObject);
  }, [transactions]);

  const handleNextPress = () => {
    console.log("asd");
  };

  const handleRefresh = () => {
    dispatch(getTransactions(walletObject));
  };

  const handleOpenBlockExplorer = async () => {
    if (!!transaction) {
      await Linking.openURL(`https://blockstream.info/tx/${transactionHash}`);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl
            enabled={true}
            refreshing={transactionsLoading}
            onRefresh={handleRefresh}
          />
        }
      >
        {!!transactions &&
          transaction &&
          Object.keys(transaction).length &&
          Object.keys(transaction).map((key) => {
            // @ts-ignore
            // TODO
            const item = transaction[key];
            return (
              <TransactionDataItem label={item.label} value={item.value} />
            );
          })}
      </ScrollView>
      <View style={{ paddingBottom: 40, paddingTop: 16 }}>
        <AppButton
          onPress={handleOpenBlockExplorer}
          text={"View in Blockexplorer"}
          theme={ButtonTheme.Primary}
          fullWidth
        />
        <AppButton
          onPress={handleRefresh}
          text={"Refresh"}
          theme={ButtonTheme.Filled}
          fullWidth
          style={{ marginVertical: 16 }}
        />
        <AppButton
          onPress={handleNextPress}
          text={"Report issue"}
          theme={ButtonTheme.Filled}
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  labelText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    lineHeight: 19,
    color: colors.secondaryFont,
    marginBottom: 8,
    marginTop: 16,
  },
  item: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingRight: 8,
    flexDirection: "row",
  },
  itemTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    lineHeight: 19,
    color: colors.primaryFont,
  },
  secondaryText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 17,
    color: colors.secondaryFont,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: colors.primaryBackgroundDarker,
  },
  itemGroup: {
    backgroundColor: colors.primaryBackgroundLighter,
    borderRadius: styleVariables.borderRadius,
  },
});
