import { Pressable, StyleSheet, View } from "react-native";
import { TextTheme, ThemedText } from "../../../shared/ThemedText";
import { colors } from "../../../constants/Colors";
import { SvgIcons } from "../../../assets/images";
import { styleVariables } from "../../../constants/StyleVariables";
import { formatAddress } from "../../../utils/helpers";

export type ContactProps = {
  name: string;
  address: string;
  selected: boolean;
  setSelectedContantAddress(address: string | undefined): void;
  clearAddressInputValue(): void;
};

export function Contact(props: ContactProps) {
  function handleContactPress(): void {
    props.setSelectedContantAddress(props.selected ? undefined : props.address);
    props.clearAddressInputValue();
  }
  return (
    <Pressable
      onPress={handleContactPress}
      style={[
        styles.contactContainer,
        {
          backgroundColor: props.selected
            ? colors.primaryAppColorDarker
            : colors.primaryBackgroundLighter,
        },
      ]}
    >
      <SvgIcons.Assets.Btc /*placeholder*/ />
      <View style={{ marginLeft: 16 }}>
        <ThemedText theme={TextTheme.ButtonText}>{props.name}</ThemedText>
        <ThemedText theme={TextTheme.ButtonText}>
          {formatAddress(props.address)}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contactContainer: {
    height: 64,
    paddingHorizontal: 16,
    borderRadius: styleVariables.borderRadius,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
});
