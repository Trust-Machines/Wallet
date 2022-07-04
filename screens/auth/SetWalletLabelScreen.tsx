import { View, StyleSheet, TextInput } from "react-native";
import { AppButton, ButtonTheme } from "../../shared/AppButton";
import { ScreenContainer } from "../../shared/ScreenContainer";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import { colors } from "../../constants/Colors";
import { en } from "../../en";
import { RootStackScreenProps } from "../../types";
import { styleVariables } from "../../constants/StyleVariables";
import { useState } from "react";
import { layout } from "../../constants/Layout";
import { useAppDispatch } from "../../redux/hooks";
import { setCurrentWalletLabel } from "../../redux/walletSlice";

export function SetWalletLabelScreen({
  navigation,
  route,
}: RootStackScreenProps<"WalletLabel">) {
  const [label, setLabel] = useState<string>("");
  const dispatch = useAppDispatch();
  const { flow } = route.params;

  const saveLabel = async () => {
    if (label.length) {
      dispatch(setCurrentWalletLabel(label));
      navigation.navigate(
        flow === "generate" ? "SaveRecoveryPhrase" : "WalletLogin"
      );
    }
  };

  return (
    <ScreenContainer showStars>
      <ThemedText
        theme={TextTheme.Headline2Text}
        styleOverwrite={{ marginTop: layout.isSmallDevice ? 10 : 60 }}
      >
        {en.Set_label_title}
      </ThemedText>
      <ThemedText
        theme={TextTheme.BodyText}
        styleOverwrite={{ marginBottom: 26 }}
      >
        {en.Set_label_subtitle}
      </ThemedText>

      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          marginBottom: "10%",
        }}
      >
        <TextInput
          value={label}
          onChangeText={(lbl: string) => setLabel(lbl)}
          style={styles.input}
          keyboardType="default"
          keyboardAppearance="dark"
          placeholderTextColor={"rgba(248, 249, 250, 0.3)"}
          placeholder={en.Set_label_placeholder}
          autoFocus
        />
        <AppButton
          onPress={saveLabel}
          text={en.Common_save}
          theme={label.length ? ButtonTheme.Primary : ButtonTheme.Disabled}
          fullWidth={true}
        />
      </View>
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
