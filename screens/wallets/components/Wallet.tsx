import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet } from "react-native";
import { colors } from "../../../constants/Colors";
import { styleVariables } from "../../../constants/StyleVariables";
import { useAppSelector } from "../../../redux/hooks";
import { TextTheme, ThemedText } from "../../../shared/ThemedText";
import { CachedWallet } from "../../../utils/asyncStorageHelper";

type WalletProps = {
  wallet: CachedWallet;
  walletID: string;
  selectWallet(wallet: any, walletID: string): void;
  selected: boolean;
};

export const Wallet = ({
  wallet,
  walletID,
  selectWallet,
  selected,
}: WalletProps) => {
  const { wallets, currentWalletID } = useAppSelector((state) => state.wallet);
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => selectWallet(wallet, walletID)}
      style={[
        styles.wallet,
        {
          backgroundColor: selected
            ? colors.primaryAppColorDarker
            : colors.primaryBackgroundLighter,
        },
      ]}
    >
      <ThemedText theme={TextTheme.LabelText}>{wallet.label}</ThemedText>
      <Pressable
        style={styles.edit}
        onPress={() => {
          navigation.navigate("WalletsStack", {
            screen: "UnlockWallet",
            params: {
              encryptedSeedPhrase: wallets[currentWalletID].seed,
              onValidationFinished: (success: boolean, password: string) => {
                if (success) {
                  navigation.navigate("WalletsStack", {
                    screen: "EditWallet",
                    params: { wallet, id: walletID },
                  });
                } else {
                  console.log("error");
                }
              },
            },
          });
        }}
      >
        <ThemedText theme={TextTheme.CaptionText}>Edit</ThemedText>
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wallet: {
    borderRadius: styleVariables.borderRadius,
    paddingLeft: 20,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  edit: {
    width: 60,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
