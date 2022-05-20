import { StyleSheet, View } from "react-native";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import { QrStackScreenProps } from "../../types";
import ModalScreenContainer from "../../shared/ModalScreenContainer";
import en from "../../en";
import QrCode from "../../assets/images/qr-placeholder.svg";
import AppButton, { ButtonTheme } from "../../shared/AppButton";
import StyleVariables from "../../constants/StyleVariables";

export default function PresentQrModal({
  navigation,
}: QrStackScreenProps<"PresentQr">) {
  return (
    <ModalScreenContainer title={en.Qr_flow_modal_title}>
      <ThemedText
        theme={TextTheme.NavigationText}
        styleOverwrite={{ marginTop: 20, marginBottom: 35 }}
      >
        {en.Qr_flow_present_qr_title}
      </ThemedText>
      <View style={styles.qrContainer}>
        <QrCode />
      </View>
      <AppButton
        text={en.Qr_flow_present_qr_button_text}
        theme={ButtonTheme.Primary}
        onPress={() => navigation.navigate("ScanQr")}
        fullWidth
        style={{ marginTop: "auto" }}
        marginBottom={80}
      />
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  qrContainer: {
    backgroundColor: "#FFF",
    borderRadius: StyleVariables.borderRadius,
  },
});
