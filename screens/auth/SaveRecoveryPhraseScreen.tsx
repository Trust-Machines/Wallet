import { View, StyleSheet } from "react-native";
import { AppButton, ButtonTheme } from "../../shared/AppButton";
import { ScreenContainer } from "../../shared/ScreenContainer";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import { colors } from "../../constants/Colors";
import { en } from "../../en";
import { CommonStackScreenProps } from "../../types";
import { SvgIcons } from "../../assets/images";
import { HDSegwitP2SHWallet } from "../../utils/wallets/hd-segwit-p2sh-wallet";
import { useEffect, useState } from "react";
import { layout } from "../../constants/Layout";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setCurrentWalletLabel,
  setNewWalletLabel,
  setWallets,
} from "../../redux/walletSlice";
import { encrypt } from "../../utils/helpers";
import {
  addWalletToAsyncStorage,
  getWalletsFromAsyncStorage,
} from "../../utils/asyncStorageHelper";
import { useNavigation } from "@react-navigation/native";

export function SaveRecoveryPhraseScreen({
  //navigation,
  route,
}: CommonStackScreenProps<"SaveRecoveryPhrase">) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [seedPhrase, setSeedPhrase] = useState<string[] | undefined>(undefined);
  const [generatedWallet, setGeneratedWallet] = useState<any>(undefined);
  const { wallets, newWalletLabel } = useAppSelector((state) => state.wallet);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    createWallet();
  }, []);

  function WordTag({ i, word }: { i: number; word: string }) {
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
        setGeneratedWallet(wallet);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        setError(true);
        console.log("generate wallet error", e);
      }
    }
  };

  const handleButtonClick = async () => {
    if (seedPhrase && seedPhrase.length) {
      // In case it's the user's first wallet password setting is needed
      if (!Object.keys(wallets).length) {
        navigation.navigate("OnboardingStack", {
          screen: "SetPassword",
          params: { seedPhrase: seedPhrase.join(" ") },
        });
      } else if (route.params?.password) {
        try {
          const addWallet = await addWalletToAsyncStorage({
            encryptedWalletSeed: encrypt(
              seedPhrase.join(" "),
              route.params.password
            ),
            walletID: generatedWallet.getID(),
            walletLabel: newWalletLabel,
          });
          const storedWallets = await getWalletsFromAsyncStorage();
          if (storedWallets) {
            dispatch(setWallets(storedWallets));
          }
          dispatch(setNewWalletLabel(""));

          navigation.navigate("NewWalletStack", {
            screen: "CreateWalletSuccess",
            params: { isFirstWallet: false },
          });
        } catch (err) {
          console.log("wallet import error", err);
        }
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
        onPress={handleButtonClick}
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
