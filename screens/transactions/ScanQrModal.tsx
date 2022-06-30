import { ActivityIndicator, StyleSheet, View } from "react-native";
import { QrStackScreenProps } from "../../types";
import { ModalScreenContainer } from "../../shared/ModalScreenContainer";
import { en } from "../../en";
import { layout } from "../../constants/Layout";
import { BarCodeScanningResult, Camera } from "expo-camera";
import { useEffect, useState } from "react";
import { colors } from "../../constants/Colors";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import { BarCodeScanner } from "expo-barcode-scanner";
import { parseQr } from "../../utils/helpers";

export function ScanQrModal({ navigation }: QrStackScreenProps<"ScanQr">) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();

      console.log("STATUS", status);
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async (
    scanningResult: BarCodeScanningResult
  ) => {
    navigation.navigate("ConfirmSend", parseQr(scanningResult.data));
  };

  console.log("HasPermission", hasPermission);

  return (
    <ModalScreenContainer title={en.Qr_flow_modal_title}>
      <View style={styles.qrContainer}>
        {hasPermission === null ? (
          <ActivityIndicator
            size="large"
            color={colors.primaryAppColorLighter}
          />
        ) : hasPermission ? (
          <Camera
            ratio="16:9"
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            }}
            onBarCodeScanned={handleBarCodeScanned}
            style={styles.camera}
          />
        ) : (
          <ThemedText theme={TextTheme.LabelText}>
            No access to camera
          </ThemedText>
        )}
      </View>
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  qrContainer: {
    flex: 1,
    backgroundColor: "#000000",
    width: layout.window.width,
    position: "absolute",
    bottom: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "10%",
  },
  camera: {
    width: layout.window.width,
    height: (layout.window.width * 16) / 9,
    maxHeight: "100%",
    padding: 20,
  },
});
