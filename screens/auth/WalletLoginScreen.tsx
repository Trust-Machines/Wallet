import { View, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { AppButton, ButtonTheme } from "../../shared/AppButton";
import { ScreenContainer } from "../../shared/ScreenContainer";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import { colors } from "../../constants/Colors";
import { en } from "../../en";
import { RootStackScreenProps } from "../../types";
import { styleVariables } from "../../constants/StyleVariables";
import { useState } from "react";
import { startImport } from "../../utils/wallets/wallet-import";
import { saveCurrentWallet } from "../../redux/walletSlice";
import { useAppDispatch } from "../../redux/hooks";
import { saveSecurely, SecureKeys } from "../../utils/secureStore";
import { layout } from "../../constants/Layout";

export function WalletLoginScreen({
  navigation,
}: RootStackScreenProps<"WalletLogin">) {
  const [seedPhrase, setSeedPhrase] = useState<string>(
    // 'guitar pattern avocado lion dizzy fiber noble scatter change vehicle lunar pluck draw fatal earth'
    "liar knee pioneer critic water gospel another butter like purity garment member"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleNextPress = () => {
    let walletType: string = "";
    // TODO seed phrase validation
    if (seedPhrase.length) {
      setLoading(true);
      const onProgress = (data: any) => {
        walletType = data;
        console.log("onProgress", data);
      };

      const onWallet = async (wallet: any) => {
        const id = wallet.getID();
        console.log("WALLETID: ", id);
        let subtitle;
        try {
          subtitle = wallet.getDerivationPath?.();

          await saveSecurely(SecureKeys.WalletType, walletType);
          dispatch(saveCurrentWallet(wallet));
          await saveSecurely(SecureKeys.SeedPhrase, wallet.secret);
          setLoading(false);
          navigation.navigate("Root");
        } catch (e) {
          setLoading(false);
          setError(true);
          console.log("onWallet error", e);
        }
      };

      const onPassword = () => {
        const pass = "123456"; // Should prompt the user to set a password or sth
        return pass;
      };

      startImport(seedPhrase, true, true, onProgress, onWallet, onPassword);
    }
  };

  return (
    <ScreenContainer showStars>
      <ThemedText
        theme={TextTheme.Headline2Text}
        styleOverwrite={{ marginTop: layout.isSmallDevice ? 10 : 60 }}
      >
        {en.Save_recovery_phrase_screen_title}
      </ThemedText>
      <ThemedText
        theme={TextTheme.BodyText}
        styleOverwrite={{ marginBottom: 26 }}
      >
        {en.Wallet_login_screen_subtitle}
      </ThemedText>
      {loading ? (
        <ActivityIndicator
          size={"large"}
          color={colors.primaryAppColorLighter}
          style={{ marginTop: "25%" }}
        />
      ) : error ? (
        <ThemedText theme={TextTheme.NavigationText}>
          Something went wrong
        </ThemedText>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            marginBottom: "10%",
          }}
        >
          <TextInput
            value={seedPhrase}
            onChangeText={(phrase: string) => setSeedPhrase(phrase)}
            style={styles.input}
            keyboardType="default"
            keyboardAppearance="dark"
            placeholderTextColor={"rgba(248, 249, 250, 0.3)"}
            multiline
            autoFocus
            textAlignVertical="top"
          />
          <AppButton
            onPress={handleNextPress}
            text={en.Common_next}
            theme={ButtonTheme.Primary}
            fullWidth={true}
          />
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: styleVariables.borderRadius,
    borderWidth: 1,
    borderColor: colors.disabled,
    padding: 16,
    paddingTop: 16,
    height: layout.isSmallDevice ? 236 : 336,
    fontFamily: "Inter_500Medium",
    fontSize: 18,
    lineHeight: 22,
    color: colors.primaryFont,
    textAlignVertical: "top",
  },
});
