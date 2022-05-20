import { View, StyleSheet, TextInput } from "react-native";
import AppButton, { ButtonTheme } from "../../shared/AppButton";
import { ScreenContainer } from "../../shared/ScreenContainer";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import Colors from "../../constants/Colors";
import en from "../../en";
import { RootStackScreenProps } from "../../types";
import StyleVariables from "../../constants/StyleVariables";

export default function WalletLoginScreen({
  navigation,
}: RootStackScreenProps<"WalletLogin">) {
  return (
    <ScreenContainer showStars>
      <ThemedText
        theme={TextTheme.Headline2Text}
        styleOverwrite={{ marginTop: 60 }}
      >
        {en.Save_recovery_phrase_screen_title}
      </ThemedText>
      <ThemedText
        theme={TextTheme.BodyText}
        styleOverwrite={{ marginBottom: 26 }}
      >
        {en.Wallet_login_screen_subtitle}
      </ThemedText>
      <TextInput
        style={styles.input}
        keyboardType="default"
        keyboardAppearance="dark"
        placeholderTextColor={"rgba(248, 249, 250, 0.3)"}
        multiline
        autoFocus
      />
      <AppButton
        onPress={() => navigation.navigate("Root")}
        text={en.Common_next}
        theme={ButtonTheme.Primary}
        fullWidth={true}
        marginBottom={70}
        style={{ marginTop: "auto" }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.inputBackground,
    borderRadius: StyleVariables.borderRadius,
    borderWidth: 1,
    borderColor: Colors.disabled,
    width: "100%",
    padding: 16,
    paddingTop: 16,
    height: 336,
    fontFamily: "Inter_500Medium",
    fontSize: 18,
    lineHeight: 22,
    color: Colors.primaryFont,
  },
});
