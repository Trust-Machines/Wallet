import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { TextTheme, ThemedText } from "./ThemedText";
import { colors } from "../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { styleVariables } from "../constants/StyleVariables";

export enum ButtonTheme {
  Primary = "Primary",
  NoBorder = "NoBorder",
  Disabled = "Disabled",
}

type AppButtonProps = {
  text: string;
  fullWidth: boolean;
  theme: ButtonTheme;
  onPress(): void;
  marginBottom?: number | string;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  paddingHorizontal?: number;
};

export function AppButton(props: AppButtonProps) {
  return (
    <TouchableOpacity
      disabled={props.theme === ButtonTheme.Disabled}
      onPress={props.onPress}
      style={[props.style, { width: props.fullWidth ? "100%" : "auto" }]}
    >
      <LinearGradient
        colors={[
          buttonColors[props.theme].gradientStartColor,
          buttonColors[props.theme].gradientEndColor,
        ]}
        style={styles.gradient}
      >
        <View
          style={{
            ...styles.button,
            backgroundColor: buttonColors[props.theme].bg,
            paddingHorizontal: props.paddingHorizontal ?? 16,
          }}
        >
          {props.icon || null}
          <ThemedText
            theme={TextTheme.ButtonText}
            styleOverwrite={{ color: buttonColors[props.theme].text }}
          >
            {props.text}
          </ThemedText>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: styleVariables.borderRadius,
    height: 48,
    maxHeight: 48,
    padding: 1,
  },
  button: {
    flex: 1,
    borderRadius: styleVariables.borderRadius,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

const buttonColors = {
  [ButtonTheme.Primary]: {
    bg: colors.primaryBackgroundLighter,
    text: colors.primaryFont,
    gradientStartColor: colors.primaryAppColorLighter,
    gradientEndColor: colors.primaryAppColorDarker,
  },
  [ButtonTheme.NoBorder]: {
    bg: "transparent",
    text: colors.primaryFont,
    gradientStartColor: "transparent",
    gradientEndColor: "transparent",
  },
  [ButtonTheme.Disabled]: {
    bg: colors.primaryBackgroundLighter,
    text: colors.disabledFont,
    gradientStartColor: colors.disabled,
    gradientEndColor: colors.disabled,
  },
};
