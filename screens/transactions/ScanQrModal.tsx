import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { TransactionStackScreenProps } from '../../navigation/nav-types';
import { ModalScreenContainer } from '@shared/ModalScreenContainer';
import { layout } from '@constants/Layout';
import { BarCodeScanningResult, Camera } from 'expo-camera';
import { useEffect, useState } from 'react';
import { colors } from '@constants/Colors';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { parseQr } from '@utils/helpers';
import { AppButton, ButtonTheme } from '@shared/AppButton';

export function ScanQrModal({ navigation }: TransactionStackScreenProps<'ScanQr'>) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();

      console.log('STATUS', status);
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async (scanningResult: BarCodeScanningResult) => {
    navigation.navigate('ConfirmTransaction', parseQr(scanningResult.data));
  };

  console.log('HasPermission', hasPermission);

  return (
    <ModalScreenContainer title={'Scan QR code'}>
      <View style={styles.qrContainer}>
        {hasPermission === null ? (
          <ActivityIndicator size="large" color={colors.primaryAppColorLighter} />
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
          <ThemedText theme={TextTheme.LabelText}>No access to camera</ThemedText>
        )}
      </View>
      <AppButton
        theme={ButtonTheme.Primary}
        text={'Display my QR'}
        fullWidth
        onPress={() => navigation.navigate('PresentQr')}
        style={{ marginTop: 'auto', marginBottom: 80 }}
      />
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  qrContainer: {
    flex: 1,
    backgroundColor: '#000000',
    width: layout.window.width,
    position: 'absolute',
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '10%',
  },
  camera: {
    width: layout.window.width,
    height: (layout.window.width * 16) / 9,
    maxHeight: '100%',
    padding: 20,
  },
});
