import { Pressable, View } from "react-native";
import { colors } from "@constants/Colors";
import { TextTheme, ThemedText } from "@shared/ThemedText";

export const TransactionDataItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <Pressable style={{ alignItems: "flex-start" }} key={label}>
      <ThemedText
        theme={TextTheme.NavigationText}
        styleOverwrite={{ marginBottom: 4, textAlign: "left" }}
      >
        {label}
      </ThemedText>
      <ThemedText
        theme={TextTheme.CaptionText}
        styleOverwrite={{
          color: colors.secondaryFont,
          marginBottom: 16,
          textAlign: "left",
        }}
      >
        {value}
      </ThemedText>
    </Pressable>
  );
};
