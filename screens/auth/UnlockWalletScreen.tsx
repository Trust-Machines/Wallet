import { View, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { AppButton, ButtonTheme } from "../../shared/AppButton";
import { ScreenContainer } from "../../shared/ScreenContainer";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import { colors } from "../../constants/Colors";
import { en } from "../../en";
import { RootStackScreenProps, WalletsStackScreenProps } from "../../types";
import { styleVariables } from "../../constants/StyleVariables";
import { useState } from "react";
import { layout } from "../../constants/Layout";
import { decrypt, encrypt } from "../../utils/helpers";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { importWallet } from "../../redux/walletSlice";

export function UnlockWalletScreen({
  navigation,
  route,
}:
  | RootStackScreenProps<"UnlockWallet">
  | WalletsStackScreenProps<"UnlockWallet">) {
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { walletError } = useAppSelector((state) => state.wallet);

  const { encryptedSeedPhrase, onValidationFinished } = route.params;
  const dispatch = useAppDispatch();

  const validatePassword = async () => {
    setLoading(true);
    // Decrypt wallet seed
    const decryptedWalletSeed = decrypt(encryptedSeedPhrase, password);
    console.log("decrypted wallet seed:", decryptedWalletSeed);

    // Import wallet with decrypted seed
    try {
      await dispatch(importWallet(decryptedWalletSeed)).unwrap();
      onValidationFinished(true, password);
    } catch (err) {
      console.log("wallet import error when unlocking wallet", err);
      onValidationFinished(false, password);
    }
    setLoading(false);
  };

  return (
    <ScreenContainer showStars>
      <ThemedText
        theme={TextTheme.Headline2Text}
        styleOverwrite={{ marginTop: layout.isSmallDevice ? 10 : 60 }}
      >
        {en.Unlock_wallet_title}
      </ThemedText>
      <ThemedText
        theme={TextTheme.BodyText}
        styleOverwrite={{ marginBottom: 26 }}
      >
        {en.Unlock_wallet_subtitle}
      </ThemedText>
      {loading ? (
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
          <View>
            <ThemedText
              theme={TextTheme.LabelText}
              styleOverwrite={styles.inputLabel}
            >
              {en.Common_password}
            </ThemedText>
            <TextInput
              secureTextEntry
              value={password}
              onChangeText={(pw: string) => setPassword(pw)}
              style={styles.input}
              keyboardType="default"
              keyboardAppearance="dark"
              placeholderTextColor={"rgba(248, 249, 250, 0.3)"}
              autoFocus
            />
          </View>

          <AppButton
            onPress={validatePassword}
            text={en.Common_save}
            theme={password.length ? ButtonTheme.Primary : ButtonTheme.Disabled}
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
    fontFamily: "Inter_500Medium",
    fontSize: 18,
    lineHeight: 22,
    color: colors.primaryFont,
  },
  inputLabel: {
    marginBottom: 8,
    marginTop: 24,
  },
});
