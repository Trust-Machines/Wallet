import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { ReceiveStackScreenProps } from '../../types';
import { ModalScreenContainer } from '@shared/ModalScreenContainer';
import { en } from '../../en';
import QRCode from 'react-native-qrcode-svg';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { styleVariables } from '@constants/StyleVariables';
import { SvgIcons } from '@assets/images';
import { colors } from '@constants/Colors';
import { layout } from '@constants/Layout';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { useEffect } from 'react';
import { getAddress } from '@redux/addressSlice';
import { createQr } from '@utils/helpers';

export function ReceivePresentQrModal({ navigation }: ReceiveStackScreenProps<'ReceivePresentQr'>) {
  const dispatch = useAppDispatch();
  const { walletObject } = useAppSelector(state => state.wallet);
  const { address, addressLoading, addressError } = useAppSelector(state => state.address);

  useEffect(() => {
    dispatch(getAddress(walletObject));
  }, []);

  return (
    <ModalScreenContainer title={en.Common_receive + ' BTC'}>
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
            styleOverwrite={{ marginTop: layout.isSmallDevice ? 0 : 20 }}
          >
            {en.Common_btc_address}
          </ThemedText>
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{
              color: colors.secondaryFont,
              marginBottom: layout.isSmallDevice ? 18 : 28,
              textAlign: 'center',
            }}
          >
            {addressLoading ? '' : address}
          </ThemedText>
          {addressLoading ? (
            <ActivityIndicator size={'large'} color={colors.primaryAppColorLighter} />
          ) : (
            <View style={styles.qrContainer}>
              {/* @ts-ignore */}
              <QRCode value={createQr(address)} size={layout.window.width - 120} />
            </View>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <AppButton
            text={en.Common_copy}
            theme={ButtonTheme.Primary}
            onPress={() => console.log('pressed')}
            fullWidth
            icon={<SvgIcons.General.Copy />}
            style={{ flex: 1, marginRight: 8 }}
          />
          <AppButton
            text={en.Common_share}
            theme={ButtonTheme.Primary}
            onPress={() => console.log('pressed')}
            fullWidth
            icon={<SvgIcons.General.Share />}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
      </View>
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  qrContainer: {
    backgroundColor: '#FFF',
    borderRadius: styleVariables.borderRadius,
    padding: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
});
