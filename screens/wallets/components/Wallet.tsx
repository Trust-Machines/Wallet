import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import { getAddress } from "../../../redux/addressSlice";
import { getBalance } from "../../../redux/balanceSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getTransactions } from "../../../redux/transactionsSlice";
import {
  setCurrentWalletID,
  setCurrentWalletLabel,
} from "../../../redux/walletSlice";
import { TextTheme, ThemedText } from "../../../shared/ThemedText";
import {
  CachedWallet,
  EncryptedSeed,
  storeCurrentWalletIdToAsyncStorage,
} from "../../../utils/asyncStorageHelper";

type WalletProps = {
  wallet: CachedWallet;
  walletID: string;
};

export const Wallet = ({ wallet, walletID }: WalletProps) => {
  const { walletObject, walletLoading } = useAppSelector(
    (state) => state.wallet
  );
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const switchWallet = (seed: EncryptedSeed) => {
    navigation.navigate("WalletsStack", {
      screen: "UnlockWallet",
      params: {
        encryptedSeedPhrase: seed,
        onValidationFinished: async (success: boolean) => {
          if (success) {
            dispatch(setCurrentWalletID(walletID));
            dispatch(setCurrentWalletLabel(wallet.label));
            await storeCurrentWalletIdToAsyncStorage(walletID);
            console.log("WWW OBJ", walletObject.secret);
            dispatch(getAddress(walletObject));
            dispatch(getBalance(walletObject));
            dispatch(getTransactions(walletObject));

            navigation.navigate("WalletsStack", { screen: "WalletSelector" });
          } else {
            console.log("error");
          }
        },
      },
    });
  };

  return (
    <Pressable onPress={() => switchWallet(wallet.seed)}>
      <ThemedText theme={TextTheme.LabelText}>{wallet.label}</ThemedText>
    </Pressable>
  );
};
