import { AppButton, ButtonTheme } from "../../shared/AppButton";
import { ScreenContainer } from "../../shared/ScreenContainer";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import { en } from "../../en";
import { OnboardingStackScreenProps } from "../../types";
import { AppSwitch } from "../../shared/AppSwitch";
import { useState } from "react";
import { Image, View } from "react-native";
import { layout } from "../../constants/Layout";
import { useNavigation } from "@react-navigation/native";

export function BiometricsScreen({
  route,
}: OnboardingStackScreenProps<"Biometrics">) {
  const [isBiometricsEnabled, setIsBiometricsEnabed] = useState(false);
  const navigation = useNavigation();

  function onToggleSwitch(value: boolean) {
    setIsBiometricsEnabed(value);
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
          source={require("../../assets/images/biometrics-screen-graphics.png")}
        />
        <ThemedText theme={TextTheme.Headline2Text}>
          {en.Biometrics_screen_title}
        </ThemedText>
        <ThemedText
          theme={TextTheme.BodyText}
          styleOverwrite={{ marginBottom: layout.isSmallDevice ? "5%" : "20%" }}
        >
          {en.Biometrics_screen_subtitle}
        </ThemedText>
        <AppSwitch
          onToggle={(value: boolean) => onToggleSwitch(value)}
          value={isBiometricsEnabled}
          firstLineText={en.Biometrics_switch_text_first_line}
          secondLineText={en.Biometrics_switch_text_second_line}
        />
      </View>
      <AppButton
        onPress={() =>
          navigation.navigate("OnboardingStack", {
            screen: "SaveRecoveryPhrase",
            params: {},
          })
        }
        text={en.Common_next}
        theme={isBiometricsEnabled ? ButtonTheme.Primary : ButtonTheme.Disabled}
        fullWidth
      />
    </ScreenContainer>
  );
}
