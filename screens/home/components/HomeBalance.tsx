import { Text, View } from "react-native";
import { TextTheme, ThemedText } from "../../../shared/ThemedText";
import { en } from "../../../en";
import { Assets } from "../../../constants/CommonEnums";
import { colors } from "../../../constants/Colors";
import { useAppSelector } from "../../../redux/hooks";
import { satoshiToBitcoinString } from "../../../utils/helpers";

export function HomeBalance() {
  const { balance } = useAppSelector((state) => state.balance);

  return (
    <View style={{ height: 166, justifyContent: "space-between" }}>
      <View>
        <ThemedText
          theme={TextTheme.CaptionText}
          styleOverwrite={{ color: colors.secondaryFont, marginBottom: 4 }}
        >
          {en.Common_balance}
        </ThemedText>
        <View style={{ flexDirection: "row" }}>
          <ThemedText
            theme={TextTheme.Headline2Text}
            styleOverwrite={{
              textAlign: "left",
              marginRight: 4,
              marginBottom: 0,
            }}
          >
            {satoshiToBitcoinString(balance ?? 0)} {Assets.BTC}
          </ThemedText>
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{ color: colors.primaryAppColorLighter }}
          >
            +3%
          </ThemedText>
        </View>
        <ThemedText theme={TextTheme.LabelText}>
          $10,761.61&nbsp;
          <ThemedText
            theme={TextTheme.LabelText}
            styleOverwrite={{ color: colors.secondaryFont }}
          >
            {Assets.USD}
          </ThemedText>
        </ThemedText>
      </View>
      <Text
        style={{
          fontFamily: "Inter_600SemiBold",
          fontSize: 10,
          lineHeight: 12,
          color: colors.disabled,
        }}
      >
        {en.Home_last_updated_label}:&nbsp;5 seconds ago
      </Text>
    </View>
  );
}
