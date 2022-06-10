import { AppButton, ButtonTheme } from "../../shared/AppButton";
import { ScreenContainer } from "../../shared/ScreenContainer";
import { en } from "../../en";
import { RootStackScreenProps } from "../../types";
import { AppSwitch } from "../../shared/AppSwitch";
import { useState } from "react";
import { colors } from "../../constants/Colors";
import { AppSuccess } from "../../shared/AppSuccess";
import { View } from "react-native";
import { layout } from "../../constants/Layout";

export function CreateWalletSuccessScreen({
  navigation,
}: RootStackScreenProps<"CreateWalletSuccess">) {
  const [isAccepted, setIsAccepted] = useState(false);

  function onToggleSwitch(value: boolean) {
    setIsAccepted(value);
  }

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
        <View style={{ marginTop: layout.isSmallDevice ? "5%" : "20%" }}>
          <AppSwitch
            onToggle={(value: boolean) => onToggleSwitch(value)}
            value={isAccepted}
            firstLineText={en.Create_wallet_success_switch_text_first_line}
            secondLineText={en.Create_wallet_success_switch_text_second_line}
            secondLineTextColor={colors.primaryAppColorLighter}
          />
        </View>
      </View>
      <AppButton
        onPress={() => navigation.navigate("Root")}
        text={en.Create_wallet_success_button_text}
        theme={isAccepted ? ButtonTheme.Primary : ButtonTheme.Disabled}
        fullWidth={true}
      />
    </ScreenContainer>
  );
}
