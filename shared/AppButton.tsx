import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { TextTheme, ThemedText } from "./ThemedText";
import Colors from "../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import StyleVariables from "../constants/StyleVariables";

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
  marginBottom?: number;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  paddingHorizontal?: number;
};

export default function AppButton(props: AppButtonProps) {
  return (
    <TouchableOpacity
      disabled={props.theme === ButtonTheme.Disabled}
      onPress={props.onPress}
      style={[
        props.style,
        {
          width: props.fullWidth ? "100%" : "auto",
          marginBottom: props.marginBottom || 0,
        },
      ]}
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
    borderRadius: StyleVariables.borderRadius,
    height: 48,
    maxHeight: 48,
    padding: 1,
  },
  button: {
    flex: 1,
    borderRadius: StyleVariables.borderRadius,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

const buttonColors = {
  [ButtonTheme.Primary]: {
    bg: Colors.primaryBackgroundLighter,
    text: Colors.primaryFont,
    gradientStartColor: Colors.primaryAppColorLighter,
    gradientEndColor: Colors.primaryAppColorDarker,
  },
  [ButtonTheme.NoBorder]: {
    bg: "transparent",
    text: Colors.primaryFont,
    gradientStartColor: "transparent",
    gradientEndColor: "transparent",
  },
  [ButtonTheme.Disabled]: {
    bg: Colors.primaryBackgroundLighter,
    text: Colors.disabledFont,
    gradientStartColor: Colors.disabled,
    gradientEndColor: Colors.disabled,
  },
};
