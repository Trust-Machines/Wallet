import { ScrollView, StyleSheet, View } from "react-native";
import { WalletsStackScreenProps } from "../../types";
import { ModalScreenContainer } from "@shared/ModalScreenContainer";
import { en } from "../../en";
import { AppButton, ButtonTheme } from "@shared/AppButton";
import { styleVariables } from "@constants/StyleVariables";
import { layout } from "@constants/Layout";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { Wallet } from "./components/Wallet";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { setCurrentWalletID, setCurrentWalletLabel } from "@redux/walletSlice";
import { storeCurrentWalletIdToAsyncStorage } from "@utils/asyncStorageHelper";

export function WalletSelectorModal({}: //navigation,
WalletsStackScreenProps<"WalletSelector">) {
  const [selectedWallet, setSelectedWallet] = useState<any>(undefined);
  const [selectedWalletID, setSelectedWalletID] = useState<string | undefined>(
    undefined
  );
  const { wallets } = useAppSelector((state) => state.wallet);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const switchWallet = () => {
    if (selectedWallet && selectedWalletID) {
      navigation.navigate("WalletsStack", {
        screen: "UnlockWallet",
        params: {
          encryptedSeedPhrase: selectedWallet.seed,
          onValidationFinished: async (success: boolean) => {
            if (success) {
              await storeCurrentWalletIdToAsyncStorage(selectedWalletID);
              dispatch(setCurrentWalletID(selectedWalletID));
              dispatch(setCurrentWalletLabel(selectedWallet.label));

              navigation.navigate("Root", { screen: "Home" });
            } else {
              console.log("error");
            }
          },
        },
      });
    }
  };

  const handleSelectWallet = (wallet: any, walletID: string) => {
    setSelectedWallet(wallet);
    setSelectedWalletID(walletID);
  };

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
            return (
              <Wallet
                wallet={wallet}
                walletID={walletID}
                selectWallet={() => handleSelectWallet(wallet, walletID)}
                selected={walletID === selectedWalletID}
              />
            );
          })}
        </ScrollView>
        <View style={{ flexDirection: "row" }}>
          <AppButton
            text={en.Wallet_selector_add_new_button_text}
            theme={ButtonTheme.Primary}
            onPress={() =>
              navigation.navigate("NewWalletStack", { screen: "AddNewWallet" })
            }
            fullWidth
            style={{ flex: 1, marginRight: 10 }}
          />
          <AppButton
            text={en.Wallet_selector_use_selected_button_text}
            theme={
              !!selectedWalletID ? ButtonTheme.Primary : ButtonTheme.Disabled
            }
            onPress={() => switchWallet()}
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
