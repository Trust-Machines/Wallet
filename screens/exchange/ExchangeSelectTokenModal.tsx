import { Pressable, StyleSheet, View } from "react-native";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import Colors from "../../constants/Colors";
import StyleVariables from "../../constants/StyleVariables";
import { ExchangeStackScreenProps } from "../../types";
import ModalScreenContainer from "../../shared/ModalScreenContainer";
import en from "../../en";
import { Assets } from "../../constants/CommonEnums";
import AssetIcons from "../../constants/AssetIcons";

export type TokenProps = {
  amount: number;
  token: Assets;
  onSelectToken(): void;
};

export default function ExchangeSelectTokenModal({
  navigation,
  route,
}: ExchangeStackScreenProps<"ExchangeSelectToken">) {
  function handleSelectToken(token: Assets): void {
    const { type, onGoBack } = route.params;
    navigation.goBack();
    onGoBack(type, token);
  }

  function Token(props: TokenProps) {
    return (
      <Pressable style={styles.tokenContainer} onPress={props.onSelectToken}>
        {AssetIcons[props.token]}
        <View style={{ marginLeft: 16 }}>
          <ThemedText theme={TextTheme.ButtonText}>{props.token}</ThemedText>
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{ color: Colors.secondaryFont }}
          >
            {props.amount}&nbsp;{props.token}
          </ThemedText>
        </View>
      </Pressable>
    );
  }

  return (
    <ModalScreenContainer title={en.Exchange_screen_modal_title}>
      <Token
        token={Assets.STX}
        amount={0}
        onSelectToken={() => handleSelectToken(Assets.STX)}
      />
      <Token
        token={Assets.BTC}
        amount={0}
        onSelectToken={() => handleSelectToken(Assets.BTC)}
      />
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  tokenContainer: {
    height: 64,
    borderRadius: StyleVariables.borderRadius,
    backgroundColor: Colors.primaryBackgroundLighter,
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
    flexDirection: "row",
    paddingHorizontal: 20,
  },
});
