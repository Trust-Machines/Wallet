import { Pressable, View } from "react-native";
import { TextTheme, ThemedText } from "../../../shared/ThemedText";
import { colors } from "../../../constants/Colors";
import { styleVariables } from "../../../constants/StyleVariables";
import { Assets } from "../../../constants/CommonEnums";
import { SvgIcons } from "../../../assets/images";
import { presentInteger, satoshiToBitcoinString } from "../../../utils/helpers";

type TransactionItemProps = {
  transaction: any;
};

export function TransactionItem(props: TransactionItemProps) {
  const { value, hash } = props.transaction;

  return (
    <Pressable
      style={{
        height: 64,
        padding: 10,
        backgroundColor: colors.primaryBackgroundLighter,
        borderRadius: styleVariables.borderRadius,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
      }}
      key={hash}
    >
      <SvgIcons.Exchange.Exchange style={{ marginRight: 8 }} />
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <ThemedText theme={TextTheme.LabelText}>
            {value > 0 ? "Received" : "Sent"}
          </ThemedText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <ThemedText
              theme={TextTheme.LabelText}
              styleOverwrite={{
                color: value > 0 ? colors.primaryAppColorLighter : colors.error,
                marginRight: 4,
              }}
            >
              {presentInteger(satoshiToBitcoinString(value))}
            </ThemedText>
            <ThemedText
              theme={TextTheme.CaptionText}
              styleOverwrite={{ color: colors.secondaryFont, paddingBottom: 1 }}
            >
              {Assets.BTC}
            </ThemedText>
          </View>
        </View>
        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{ color: colors.secondaryFont }}
          >
            Bitcoin
          </ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <ThemedText
              theme={TextTheme.CaptionText}
              styleOverwrite={{ color: colors.error, marginRight: 4 }}
            >
              -0.000001
            </ThemedText>
            <ThemedText
              theme={TextTheme.CaptionText}
              styleOverwrite={{ color: colors.secondaryFont }}
            >
              {Assets.BTC}
            </ThemedText>
          </View>
        </View> */}
      </View>
    </Pressable>
  );
}
