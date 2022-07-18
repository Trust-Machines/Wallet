import { AppButton, ButtonTheme } from "@shared/AppButton";
import { ScreenContainer } from "@shared/ScreenContainer";
import { TextTheme, ThemedText } from "@shared/ThemedText";
import { en } from "../../en";
import { OnboardingStackScreenProps } from "../../types";
import { AppSwitch } from "@shared/AppSwitch";
import { useState } from "react";
import { Image, View } from "react-native";
import { layout } from "@constants/Layout";

export function AcceptTOSScreen({
  navigation,
  route,
}: OnboardingStackScreenProps<"AcceptTOS">) {
  const [isAccepted, setIsAccepted] = useState(false);
  const { flow } = route.params;

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
        <Image
          style={{
            marginTop: layout.isSmallDevice ? 0 : "10%",
            alignSelf: "center",
          }}
          source={require("@assets/images/biometrics-screen-graphics.png")}
        />
        <ThemedText theme={TextTheme.Headline2Text}>
          {en.Accept_TOS_title}
        </ThemedText>
        <ThemedText
          theme={TextTheme.BodyText}
          styleOverwrite={{ marginBottom: layout.isSmallDevice ? "5%" : "20%" }}
        >
          {en.Accept_TOS_subtitle}
        </ThemedText>
        <AppSwitch
          onToggle={(value: boolean) => onToggleSwitch(value)}
          value={isAccepted}
          firstLineText={en.Accept_TOS_switch_text_first_line}
          secondLineText={en.Accept_TOS_switch_text_second_line}
        />
      </View>
      <AppButton
        onPress={() => navigation.navigate("WalletLabel", { flow })}
        text={en.Common_next}
        theme={isAccepted ? ButtonTheme.Primary : ButtonTheme.Disabled}
        fullWidth
      />
    </ScreenContainer>
  );
}
