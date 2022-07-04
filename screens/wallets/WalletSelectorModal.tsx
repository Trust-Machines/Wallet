import { ScrollView, StyleSheet, View } from "react-native";
import { WalletsStackScreenProps } from "../../types";
import { ModalScreenContainer } from "../../shared/ModalScreenContainer";
import { en } from "../../en";
import { AppButton, ButtonTheme } from "../../shared/AppButton";
import { styleVariables } from "../../constants/StyleVariables";
import { layout } from "../../constants/Layout";
import { useAppSelector } from "../../redux/hooks";
import { Wallet } from "./components/Wallet";
import { useNavigation } from "@react-navigation/native";

export function WalletSelectorModal({
  navigation,
}: WalletsStackScreenProps<"WalletSelector">) {
  const { wallets } = useAppSelector((state) => state.wallet);
  const nav = useNavigation();

  return (
    <ModalScreenContainer title={en.Wallet_selector_modal_title}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          marginBottom: layout.isSmallDevice ? 0 : "10%",
        }}
      >
        <ScrollView>
          {Object.keys(wallets).map((walletID: string) => {
            const wallet = wallets[walletID];
            return <Wallet wallet={wallet} walletID={walletID} />;
          })}
        </ScrollView>
        <View style={{ flexDirection: "row" }}>
          <AppButton
            text={en.Wallet_selector_add_new_button_text}
            theme={ButtonTheme.Primary}
            onPress={() =>
              nav.navigate("NewWalletStack", { screen: "AddNewWallet" })
            }
            fullWidth
            style={{ flex: 1, marginRight: 10 }}
          />
          <AppButton
            text={en.Wallet_selector_use_selected_button_text}
            theme={ButtonTheme.Primary}
            onPress={() => navigation.goBack()}
            fullWidth
            style={{ flex: 1, marginLeft: 10 }}
          />
        </View>
      </View>
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  qrContainer: {
    backgroundColor: "#FFF",
    borderRadius: styleVariables.borderRadius,
    alignItems: "center",
    padding: 40,
    marginBottom: 12,
  },
});
