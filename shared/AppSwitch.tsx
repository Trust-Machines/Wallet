import { StyleSheet, Switch, View } from "react-native";
import Colors from "../constants/Colors";
import StyleVariables from "../constants/StyleVariables";
import { TextTheme, ThemedText } from "./ThemedText";

type SwitchProps = {
  onToggle(value: boolean): void;
  value: boolean;
  firstLineText: string;
  secondLineText?: string;
  firstLineTextColor?: string;
  secondLineTextColor?: string;
};

export default function AppSwitch(props: SwitchProps) {
  return (
    <View style={styles.container}>
      <View style={{ marginRight: 16 }}>
        <ThemedText
          theme={TextTheme.BodyText}
          styleOverwrite={{
            textAlign: "left",
            color: props.firstLineTextColor || Colors.primaryFont,
          }}
        >
          {props.firstLineText}
        </ThemedText>
        {props.secondLineText && (
          <ThemedText
            theme={TextTheme.BodyText}
            styleOverwrite={{
              textAlign: "left",
              color: props.secondLineTextColor || Colors.primaryFont,
              fontFamily: "Inter_700Bold",
            }}
          >
            {props.secondLineText}
          </ThemedText>
        )}
      </View>
      <Switch
        trackColor={{ false: "#767577", true: Colors.primaryAppColorDarker }}
        thumbColor={"#FFFFFF"}
        ios_backgroundColor="#767577"
        onValueChange={props.onToggle}
        value={props.value}
        style={styles.switch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    borderRadius: StyleVariables.borderRadius,
    padding: 16,
    backgroundColor: Colors.primaryBackgroundDarker,
    alignItems: "center",
    justifyContent: "space-between",
  },
  switch: {
    borderWidth: 1,
    borderColor: Colors.disabled,
  },
});
