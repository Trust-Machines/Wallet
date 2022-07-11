import {
  StyleSheet,
  Pressable,
  SafeAreaView,
  TextInput,
  View,
} from "react-native";
import { TextTheme, ThemedText } from "@shared/ThemedText";
import { Assets } from "@constants/CommonEnums";
import { SvgIcons } from "@assets/images";
import { colors } from "@constants/Colors";
import { assetIcons } from "@constants/AssetIcons";
import { safeParseFloat } from "@utils/helpers";

export type ExchangeInputProps = {
  amount: number;
  asset: Assets;
  setAmount(value: number): void;
  openAssetSelectorModal(): void;
};

export function ExchangeInput(props: ExchangeInputProps) {
  return (
    <SafeAreaView style={styles.stretchContainer}>
      <TextInput
        style={styles.amountInput}
        value={props.amount.toString()}
        onChangeText={(value) => props.setAmount(safeParseFloat(value))}
        keyboardType="decimal-pad"
        keyboardAppearance="dark"
      />
      <Pressable
        style={styles.assetSelector}
        onPress={props.openAssetSelectorModal}
      >
        {assetIcons[props.asset]}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ThemedText theme={TextTheme.CaptionText}>{props.asset}</ThemedText>
          <SvgIcons.General.ChevronDown />
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  stretchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  amountInput: {
    fontFamily: "Inter_500Medium",
    fontSize: 28,
    lineHeight: 34,
    color: colors.secondaryFont,
    flex: 1,
  },
  assetSelector: {
    borderRadius: 80,
    backgroundColor: colors.primaryBackgroundLighter,
    width: 126,
    paddingLeft: 16,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
