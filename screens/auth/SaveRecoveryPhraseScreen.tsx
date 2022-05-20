import { View, StyleSheet } from "react-native";
import AppButton, { ButtonTheme } from "../../shared/AppButton";
import { ScreenContainer } from "../../shared/ScreenContainer";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import Colors from "../../constants/Colors";
import en from "../../en";
import { RootStackScreenProps } from "../../types";
import { SvgIcons } from "../../assets/images";

const phraseWords = [
  "glom",
  "police",
  "month",
  "stamp",
  "viable",
  "claim",
  "hospital",
  "heart",
  "alcohol",
  "off",
  "ocean",
  "ghost",
];

export default function SaveRecoveryPhraseScreen({
  navigation,
}: RootStackScreenProps<"SaveRecoveryPhrase">) {
  function WordTag(props: any) {
    return (
      <View style={{ padding: 8 }}>
        <View style={styles.tag}>
          <ThemedText
            theme={TextTheme.InputText}
            styleOverwrite={{ marginRight: 14 }}
          >
            {props.i + 1}
          </ThemedText>
          <ThemedText theme={TextTheme.InputText}>{props.word}</ThemedText>
        </View>
      </View>
    );
  }

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
        styleOverwrite={{ marginBottom: 27 }}
      >
        {en.Save_recovery_phrase_screen_subtitle}
      </ThemedText>
      <View style={styles.tagContainer}>
        {phraseWords.map((word, i) => (
          <WordTag word={word} i={i} key={word} />
        ))}
      </View>
      <AppButton
        onPress={() => console.log("copied")}
        text={en.Copy_to_clipboard}
        theme={ButtonTheme.NoBorder}
        fullWidth={true}
        style={{ marginTop: 8 }}
        icon={<SvgIcons.General.CopyToClipboard />}
      />
      <AppButton
        onPress={() => navigation.navigate("CreateWalletSuccess")}
        text={en.Save_recovery_phrase_button_text}
        theme={ButtonTheme.Primary}
        fullWidth={true}
        marginBottom={70}
        style={{ marginTop: "auto" }}
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
    backgroundColor: Colors.primaryBackgroundDarker,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.disabled,
    minWidth: 140,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    justifyContent: "center",
  },
});
