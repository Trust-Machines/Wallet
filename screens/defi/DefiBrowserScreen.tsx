import { StyleSheet, TextInput, View } from "react-native";
import { ScreenContainer } from "../../shared/ScreenContainer";
import { RootTabScreenProps } from "../../types";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import Colors from "../../constants/Colors";
import StyleVariables from "../../constants/StyleVariables";
import { SvgIcons } from "../../assets/images";
import en from "../../en";

export default function DefiBrowserScreen({
  navigation,
}: RootTabScreenProps<"DefiBrowser">) {
  return (
    <ScreenContainer paddingTop={55} withTab>
      <View style={{ position: "relative", width: "100%" }}>
        <TextInput
          style={[styles.inputContainer, styles.searchInput]}
          keyboardType="default"
          keyboardAppearance="dark"
          placeholder={en.Defi_browser_search_placeholder}
          placeholderTextColor={"rgba(248, 249, 250, 0.3)"}
        />
        <SvgIcons.General.Search style={{ position: "absolute", right: 0 }} />
      </View>
      <View
        style={{
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <SvgIcons.Defi.Globe60 style={{ marginBottom: 20 }} />
        <ThemedText theme={TextTheme.LabelText}>
          {en.Defi_browser_launch_label}
        </ThemedText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    fontFamily: "Inter_500Medium",
    fontSize: 18,
    lineHeight: 22,
    color: Colors.primaryFont,
    height: 40,
    paddingRight: 40,
  },
  inputContainer: {
    backgroundColor: Colors.inputBackground,
    borderRadius: StyleVariables.borderRadius,
    borderWidth: 1,
    borderColor: Colors.disabled,
    width: "100%",
    paddingHorizontal: 10,
    alignItems: "center",
  },
});
