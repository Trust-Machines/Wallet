import { StyleSheet, View } from "react-native";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import { ReceiveStackScreenProps } from "../../types";
import ModalScreenContainer from "../../shared/ModalScreenContainer";
import en from "../../en";
import QrCode from "../../assets/images/qr-placeholder.svg";
import AppButton, { ButtonTheme } from "../../shared/AppButton";
import StyleVariables from "../../constants/StyleVariables";
import { SvgIcons } from "../../assets/images";
import Colors from "../../constants/Colors";

export default function ReceivePresentQrModal({
  navigation,
}: ReceiveStackScreenProps<"ReceivePresentQr">) {
  return (
    <ModalScreenContainer title={en.Common_receive + " BTC"}>
      <ThemedText
        theme={TextTheme.NavigationText}
        styleOverwrite={{ marginTop: 20 }}
      >
        {en.Common_btc_address}
      </ThemedText>
      <ThemedText
        theme={TextTheme.CaptionText}
        styleOverwrite={{ color: Colors.secondaryFont, marginBottom: 28 }}
      >
        bc1qyl8k4wkahuepwwp3rlmzcqhv6cpc9ccla4
      </ThemedText>
      <View style={styles.qrContainer}>
        <QrCode />
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          text={en.Common_copy}
          theme={ButtonTheme.Primary}
          onPress={() => console.log("pressed")}
          fullWidth
          icon={<SvgIcons.General.Copy />}
          style={{ flex: 1, marginRight: 8 }}
        />
        <AppButton
          text={en.Common_share}
          theme={ButtonTheme.Primary}
          onPress={() => console.log("pressed")}
          fullWidth
          icon={<SvgIcons.General.Share />}
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  qrContainer: {
    backgroundColor: "#FFF",
    borderRadius: StyleVariables.borderRadius,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: "auto",
    width: "100%",
    marginBottom: 80,
  },
});
