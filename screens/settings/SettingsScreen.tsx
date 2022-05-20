import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "../../shared/ScreenContainer";
import { RootTabScreenProps } from "../../types";
import Colors from "../../constants/Colors";
import StyleVariables from "../../constants/StyleVariables";
import en from "../../en";
import { SvgIcons } from "../../assets/images";

export default function SettingsScreen({
  navigation,
}: RootTabScreenProps<"Settings">) {
  const Label = ({ label }: any) => {
    return <Text style={styles.labelText}>{label}</Text>;
  };

  const Separator = () => {
    return <View style={styles.separator}></View>;
  };

  type ItemProps = {
    title: string;
    withChevron?: boolean;
    handlePress(): void;
    color?: string;
    secondaryText?: string;
  };

  const Item = (props: ItemProps) => {
    return (
      <Pressable
        style={[styles.item, { paddingVertical: props.secondaryText ? 12 : 8 }]}
      >
        <View>
          <Text
            style={[
              styles.itemTitle,
              { color: props.color ?? Colors.primaryFont },
            ]}
          >
            {props.title}
          </Text>
          {props.secondaryText ? (
            <Text style={styles.secondaryText}>{props.secondaryText}</Text>
          ) : null}
        </View>
        {props.withChevron ? <SvgIcons.General.ChevronRight /> : null}
      </Pressable>
    );
  };

  return (
    <ScreenContainer paddingTop={5}>
      <Label label={en.Settings_label_profile} />
      <View style={styles.itemGroup}>
        <Item
          title={"My TrustMachines Wallet"}
          secondaryText={"9Hvt...0a0b"}
          withChevron
          handlePress={() => console.log("pressed")}
        />
      </View>

      <Label label={en.Settings_label_security} />
      <View style={styles.itemGroup}>
        <Item
          title={en.Settings_screen_recovery_phrase}
          withChevron
          handlePress={() => console.log("pressed")}
        />
        <Separator />
        <Item
          title={en.Settings_screen_app_lock}
          withChevron
          handlePress={() => console.log("pressed")}
        />
      </View>

      <Label label={en.Settings_label_notifications} />
      <View style={styles.itemGroup}>
        <Item
          title={en.Settings_screen_notifications_settings}
          withChevron
          handlePress={() => console.log("pressed")}
        />
      </View>

      <Label label={en.Settings_label_others} />
      <View style={styles.itemGroup}>
        <Item
          title={en.Settings_screen_contact_us}
          withChevron
          handlePress={() => console.log("pressed")}
        />
        <Separator />
        <Item
          title={en.Settings_screen_sign_out}
          withChevron
          handlePress={() => console.log("pressed")}
          color={Colors.error}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  labelText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    lineHeight: 19,
    color: Colors.secondaryFont,
    marginBottom: 8,
    marginTop: 16,
    width: "100%",
  },
  item: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingRight: 8,
    flexDirection: "row",
    width: "100%",
  },
  itemTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    lineHeight: 19,
    color: Colors.primaryFont,
  },
  secondaryText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 17,
    color: Colors.secondaryFont,
    marginTop: 2,
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: Colors.primaryBackgroundDarker,
  },
  itemGroup: {
    backgroundColor: Colors.primaryBackgroundLighter,
    borderRadius: StyleVariables.borderRadius,
    width: "100%",
  },
});
