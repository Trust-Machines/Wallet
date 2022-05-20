import { Image, StyleSheet, View } from "react-native";
import AppButton, { ButtonTheme } from "../../shared/AppButton";
import { ScreenContainer } from "../../shared/ScreenContainer";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import Colors from "../../constants/Colors";
import en from "../../en";
import { RootStackScreenProps } from "../../types";

export default function StartScreen({
  navigation,
}: RootStackScreenProps<"Start">) {
  return (
    <ScreenContainer showStars>
      <Image
        source={require("../../assets/images/start-screen-graphics.png")}
        style={{ marginTop: "25%" }}
      />
      <ThemedText theme={TextTheme.Headline2Text}>
        <ThemedText
          theme={TextTheme.Headline2Text}
          style={{ color: Colors.primaryAppColorLighter }}
        >
          {en.Wallet_name}&nbsp;
        </ThemedText>
        {en.Start_screen_title}
      </ThemedText>
      <View style={styles.buttonContainer}>
        <AppButton
          onPress={() => navigation.navigate("Biometrics")}
          text={en.Create_new_wallet_button_text}
          theme={ButtonTheme.Primary}
          fullWidth
          marginBottom={9}
        />
        <AppButton
          onPress={() => navigation.navigate("WalletLogin")}
          text={en.User_has_wallet_button_text}
          theme={ButtonTheme.NoBorder}
          fullWidth
          marginBottom={70}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    marginTop: "auto",
    width: "100%",
  },
});
