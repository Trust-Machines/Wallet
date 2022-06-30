import { View, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { AppButton, ButtonTheme } from "../../shared/AppButton";
import { ScreenContainer } from "../../shared/ScreenContainer";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import { colors } from "../../constants/Colors";
import { en } from "../../en";
import { RootStackScreenProps } from "../../types";
import { styleVariables } from "../../constants/StyleVariables";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { layout } from "../../constants/Layout";
import { importWallet } from "../../redux/walletSlice";

export function WalletLoginScreen({
  navigation,
}: RootStackScreenProps<"WalletLogin">) {
  const dispatch = useAppDispatch();
  const [seedPhrase, setSeedPhrase] = useState<string>(
    // 'guitar pattern avocado lion dizzy fiber noble scatter change vehicle lunar pluck draw fatal earth'
    "liar knee pioneer critic water gospel another butter like purity garment member"
  );
  const { wallet, walletLoading, walletError } = useAppSelector(
    (state) => state.wallet
  );

  useEffect(() => {}, [wallet, walletLoading, walletError]);

  const handleNextPress = async () => {
    if (seedPhrase.length) {
      try {
        await dispatch(importWallet(seedPhrase)).unwrap();
        navigation.navigate("Root");
      } catch (err) {
        console.log("wallet import error", err);
      }
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
      {walletLoading ? (
        <ActivityIndicator
          size={"large"}
          color={colors.primaryAppColorLighter}
          style={{ marginTop: "25%" }}
        />
      ) : walletError ? (
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
