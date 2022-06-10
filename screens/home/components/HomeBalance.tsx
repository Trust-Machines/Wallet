import { ActivityIndicator, Text, View } from "react-native";
import { TextTheme, ThemedText } from "../../../shared/ThemedText";
import { en } from "../../../en";
import { Assets } from "../../../constants/CommonEnums";
import { colors } from "../../../constants/Colors";
import { useAppSelector } from "../../../redux/hooks";
import { satoshiToBitcoinString } from "../../../utils/helpers";

export function HomeBalance() {
  const { value, loading, error } = useAppSelector(
    (state) => state.wallet.currentWalletBalance
  );

  const balance = {
    STX: satoshiToBitcoinString(value),
    USD: "10,761.61",
    change: "+3%",
    lastUpdated: "5 seconds ago",
  };

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
            {loading ? (
              <ActivityIndicator
                size="small"
                color={colors.primaryAppColorLighter}
              />
            ) : (
              balance.STX
            )}{" "}
            {Assets.BTC}
          </ThemedText>
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{ color: colors.primaryAppColorLighter }}
          >
            {balance.change}
          </ThemedText>
        </View>
        <ThemedText theme={TextTheme.LabelText}>
          ${balance.USD}&nbsp;
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
        {en.Home_last_updated_label}:&nbsp;{balance.lastUpdated}
      </Text>
    </View>
  );
}
