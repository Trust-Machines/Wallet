import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { QrStackScreenProps } from '../../types';
import { ModalScreenContainer } from '@shared/ModalScreenContainer';
import { en } from '../../en';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { styleVariables } from '@constants/StyleVariables';
import { layout } from '@constants/Layout';
import QRCode from 'react-native-qrcode-svg';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { getAddress } from '@redux/addressSlice';
import { colors } from '@constants/Colors';
import { createQr } from '@utils/helpers';

export function PresentQrModal({ navigation }: QrStackScreenProps<'PresentQr'>) {
  const dispatch = useAppDispatch();
  const { walletObject } = useAppSelector(state => state.wallet);
  const { address, addressLoading, addressError } = useAppSelector(state => state.address);

  useEffect(() => {
    dispatch(getAddress(walletObject));
  }, []);

  return (
    <ModalScreenContainer title={en.Qr_flow_modal_title}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          marginBottom: layout.isSmallDevice ? 0 : '10%',
        }}
      >
        <View>
          <ThemedText
            theme={TextTheme.NavigationText}
            styleOverwrite={{
              marginTop: layout.isSmallDevice ? 0 : 20,
              marginBottom: layout.isSmallDevice ? 15 : 35,
            }}
          >
            {en.Qr_flow_present_qr_title}
          </ThemedText>
          {addressLoading ? (
            <ActivityIndicator size={'large'} color={colors.primaryAppColorLighter} />
          ) : (
            <>
              <View style={styles.qrContainer}>
                <QRCode value={createQr(address)} size={layout.window.width - 120} />
              </View>
              <ThemedText
                theme={TextTheme.CaptionText}
                styleOverwrite={{
                  color: colors.secondaryFont,
                  textAlign: 'center',
                }}
              >
                {address}
              </ThemedText>
            </>
          )}
        </View>
        <AppButton
          text={en.Qr_flow_present_qr_button_text}
          theme={ButtonTheme.Primary}
          onPress={() => navigation.navigate('ScanQr')}
          fullWidth
          style={{ marginTop: 'auto' }}
          marginBottom={80}
        />
      </View>
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  qrContainer: {
    backgroundColor: '#FFF',
    borderRadius: styleVariables.borderRadius,
    alignItems: 'center',
    padding: 40,
    marginBottom: 12,
  },
});
