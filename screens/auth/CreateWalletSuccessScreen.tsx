import { AppButton, ButtonTheme } from "../../shared/AppButton";
import { ScreenContainer } from "../../shared/ScreenContainer";
import { en } from "../../en";
import { RootStackScreenProps } from "../../types";
import { AppSuccess } from "../../shared/AppSuccess";
import { View } from "react-native";
import { layout } from "../../constants/Layout";

export function CreateWalletSuccessScreen({
  navigation,
}: RootStackScreenProps<"CreateWalletSuccess">) {
  return (
    <ScreenContainer
      showStars
      styles={{
        justifyContent: "space-between",
        paddingBottom: layout.isSmallDevice ? 0 : "15%",
      }}
    >
      <View>
        <AppSuccess
          text={en.Create_wallet_success_text}
          style={{ marginTop: layout.isSmallDevice ? 0 : "10%" }}
        />
      </View>
      <AppButton
        onPress={() => navigation.navigate("Root")}
        text={en.Create_wallet_success_button_text}
        theme={ButtonTheme.Primary}
        fullWidth={true}
      />
    </ScreenContainer>
  );
}
