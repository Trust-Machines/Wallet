import { View, StyleSheet } from "react-native";
import { AppButton, ButtonTheme } from "../../shared/AppButton";
import { ScreenContainer } from "../../shared/ScreenContainer";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import { colors } from "../../constants/Colors";
import { en } from "../../en";
import { RootStackScreenProps } from "../../types";
import { SvgIcons } from "../../assets/images";
import { HDSegwitP2SHWallet } from "../../utils/wallets/hd-segwit-p2sh-wallet";
import { useEffect, useState } from "react";
import { saveCurrentWallet } from "../../redux/walletSlice";
import { useAppDispatch } from "../../redux/hooks";
import { saveSecurely, SecureKeys } from "../../utils/secureStore";
import { layout } from "../../constants/Layout";

type WordTagProps = {
  i: number;
  word: string;
};

export function SaveRecoveryPhraseScreen({
  navigation,
}: RootStackScreenProps<"SaveRecoveryPhrase">) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [seedPhrase, setSeedPhrase] = useState<string[] | undefined>(undefined);
  const dispatch = useAppDispatch();

  useEffect(() => {
    createWallet();
  }, []);

  function WordTag({ i, word }: WordTagProps) {
    return (
      <View style={{ padding: layout.isSmallDevice ? 4 : 8 }}>
        <View style={styles.tag}>
          <ThemedText
            theme={TextTheme.InputText}
            styleOverwrite={{ marginRight: 14 }}
          >
            {i + 1}
          </ThemedText>
          <ThemedText theme={TextTheme.InputText}>{word}</ThemedText>
        </View>
      </View>
    );
  }

  const createWallet = async () => {
    if (!seedPhrase) {
      setLoading(true);
      try {
        const wallet = new HDSegwitP2SHWallet();
        await wallet.generate();
        setSeedPhrase(wallet.secret.split(" "));
        dispatch(saveCurrentWallet(wallet));

        await saveSecurely(SecureKeys.SeedPhrase, wallet.secret);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        setError(true);
        console.log("generate wallet error", e);
      }
    }
  };

  return (
    <ScreenContainer
      showStars
      styles={{
        justifyContent: "space-between",
        paddingBottom: layout.isSmallDevice ? 0 : "15%",
      }}
    >
      <View>
        <ThemedText
          theme={TextTheme.Headline2Text}
          styleOverwrite={{ marginTop: layout.isSmallDevice ? 0 : 60 }}
        >
          {en.Save_recovery_phrase_screen_title}
        </ThemedText>
        <ThemedText
          theme={TextTheme.BodyText}
          styleOverwrite={{ marginBottom: layout.isSmallDevice ? 7 : 27 }}
        >
          {en.Save_recovery_phrase_screen_subtitle}
        </ThemedText>
        <View>
          {loading ? (
            <ThemedText theme={TextTheme.NavigationText}>Loading...</ThemedText>
          ) : error ? (
            <ThemedText theme={TextTheme.NavigationText}>
              Something went wrong
            </ThemedText>
          ) : (
            <View style={styles.tagContainer}>
              {seedPhrase?.map((word, i) => (
                <WordTag word={word} i={i} key={word} />
              ))}
            </View>
          )}
        </View>
        <AppButton
          onPress={() => console.log("copied")}
          text={en.Copy_to_clipboard}
          theme={ButtonTheme.NoBorder}
          fullWidth
          style={{ marginTop: 8 }}
          icon={<SvgIcons.General.CopyToClipboard />}
        />
      </View>
      <AppButton
        onPress={() => navigation.navigate("CreateWalletSuccess")}
        text={en.Save_recovery_phrase_button_text}
        theme={ButtonTheme.Primary}
        fullWidth
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    borderRadius: 48,
    padding: 9,
    paddingLeft: 23,
    backgroundColor: colors.primaryBackgroundDarker,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.disabled,
    minWidth: 140,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
