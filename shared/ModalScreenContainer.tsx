import { Pressable, StyleSheet, View } from "react-native";
import { ScreenContainer } from "./ScreenContainer";
import { TextTheme, ThemedText } from "./ThemedText";
import { colors } from "../constants/Colors";
import { layout } from "../constants/Layout";
import { styleVariables } from "../constants/StyleVariables";
import { SvgIcons } from "../assets/images";
import { useNavigation } from "@react-navigation/native";

type ModalScreenProps = {
  title: string;
  children: React.ReactNode;
};

export function ModalScreenContainer({ title, children }: ModalScreenProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.fullContainer}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <ThemedText theme={TextTheme.LabelText}>{title}</ThemedText>
          <Pressable
            style={styles.close}
            onPress={() => navigation.getParent()?.goBack()}
          >
            <SvgIcons.General.CloseModal />
          </Pressable>
        </View>
        <ScreenContainer paddingTop={20}>{children}</ScreenContainer>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    height: layout.window.height - styleVariables.headerHeight,
    width: "100%",
  },
  header: {
    backgroundColor: colors.primaryBackgroundDarker,
    height: layout.isSmallDevice ? 45 : 65,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: "relative",
  },
  close: {
    position: "absolute",
    left: 20,
  },
});
