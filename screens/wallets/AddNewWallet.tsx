import { Image, View } from "react-native";
import { AppButton, ButtonTheme } from "../../shared/AppButton";
import { ScreenContainer } from "../../shared/ScreenContainer";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import { en } from "../../en";
import {
  NewWalletStackParamList,
  NewWalletStackScreenProps,
  RootStackScreenProps,
} from "../../types";
import { layout } from "../../constants/Layout";
import { useAppSelector } from "../../redux/hooks";

export function AddNewWalletScreen({
  navigation,
}: NewWalletStackScreenProps<"AddNewWallet">) {
  const { wallets, currentWalletID } = useAppSelector((state) => state.wallet);

  return (
    <ScreenContainer
      showStars
      styles={{
        marginBottom: layout.isSmallDevice ? "5%" : "10%",
      }}
    >
      <View>
        <Image
          source={require("../../assets/images/start-screen-graphics.png")}
          style={{
            marginTop: layout.isSmallDevice ? "0%" : "20%",
            alignSelf: "center",
          }}
        />
        <ThemedText theme={TextTheme.Headline2Text}>
          {en.Add_new_wallet_screen_title}
        </ThemedText>
      </View>

      <View style={{ marginTop: "auto" }}>
        <AppButton
          onPress={() =>
            navigation.navigate("UnlockWallet", {
              encryptedSeedPhrase: wallets[currentWalletID].seed,
              onValidationFinished: (success: boolean, password: string) => {
                if (success) {
                  navigation.navigate("SaveRecoveryPhrase", { password });
                } else {
                  console.log("error");
                }
              },
            })
          }
          text={en.Add_new_wallet_generate_button_text}
          theme={ButtonTheme.Primary}
          fullWidth
          marginBottom={9}
        />
        <AppButton
          onPress={() =>
            navigation.navigate("UnlockWallet", {
              encryptedSeedPhrase: wallets[currentWalletID].seed,
              onValidationFinished: (success: boolean, password: string) => {
                if (success) {
                  navigation.navigate("WalletLogin", { password });
                } else {
                  console.log("error");
                }
              },
            })
          }
          text={en.Add_new_wallet_import_button_text}
          theme={ButtonTheme.NoBorder}
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
}
