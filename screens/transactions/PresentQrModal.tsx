import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { TransactionStackScreenProps } from '../../types';
import { ModalScreenContainer } from '@shared/ModalScreenContainer';
import { en } from '../../en';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { styleVariables } from '@constants/StyleVariables';
import { layout } from '@constants/Layout';
import QRCode from 'react-native-qrcode-svg';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { getAddress } from '@redux/addressSlice';
import { colors } from '@constants/Colors';
import { createQr, formatAddress, safeParseFloat } from '@utils/helpers';
import { SvgIcons } from '@assets/images';
import { AppAmountInput } from '@shared/AppAmountInput';

export function PresentQrModal({ navigation }: TransactionStackScreenProps<'PresentQr'>) {
  const [amount, setAmount] = useState<string>('0');
  const dispatch = useAppDispatch();
  const { walletObject } = useAppSelector(state => state.wallet);
  const { address, addressLoading, addressError } = useAppSelector(state => state.address);

  useEffect(() => {
    dispatch(getAddress(walletObject));
  }, []);

  return (
    <ModalScreenContainer title={en.Qr_flow_present_qr_title}>
      {addressLoading ? (
        <ActivityIndicator size={'large'} color={colors.primaryAppColorLighter} />
      ) : (
        <View
          style={{
            flex: 1,
            marginBottom: '10%',
          }}
        >
          <View style={{ position: 'relative' }}>
            <View style={styles.qrOuterContainer}>
              <View style={styles.qrInnerContainer}>
                {/* @ts-ignore */}
                <QRCode value={createQr(address, amount)} size={layout.window.width - 116} />
              </View>
            </View>
            <View
              style={{
                ...styles.qrTextContainer,
                top: -11,
              }}
            >
              <ThemedText
                theme={TextTheme.CaptionText}
                styleOverwrite={{
                  ...styles.qrText,
                  backgroundColor: colors.primaryBackgroundDarker,
                }}
              >
                ({formatAddress(address)})
              </ThemedText>
            </View>
            <View
              style={{
                ...styles.qrTextContainer,
                bottom: -11,
              }}
            >
              <ThemedText
                theme={TextTheme.CaptionText}
                styleOverwrite={{
                  ...styles.qrText,
                  backgroundColor: colors.primaryBackgroundLighter,
                  color: colors.primaryFont,
                }}
              >
                {safeParseFloat(amount) <= 0
                  ? 'No amount assigned to QR code'
                  : `Amount assigned to QR code: ${amount} BTC`}
              </ThemedText>
            </View>
          </View>

          <AppAmountInput
            amount={amount}
            setAmount={value => setAmount(value)}
            labelText={'Assign amount to QR code:'}
            style={{ marginTop: 24 }}
          />

          <AppButton
            text={en.Copy_to_clipboard}
            theme={ButtonTheme.NoBorder}
            onPress={() => navigation.navigate('ScanQr')}
            fullWidth
            icon={<SvgIcons.General.CopyToClipboard />}
            style={{ marginTop: 'auto' }}
          />
        </View>
      )}
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  qrOuterContainer: {
    borderWidth: 1,
    borderColor: colors.disabled,
    borderRadius: styleVariables.borderRadius,
    padding: 22,
  },
  qrInnerContainer: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    padding: 16,
  },
  qrText: {
    // borderWidth: 1,
    // borderColor: colors.disabled,
    fontSize: 12,
    color: colors.secondaryFont,
    textAlign: 'center',
    borderRadius: 2,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  qrTextContainer: {
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.disabled,
    flex: 1,
  },
  amountInput: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 32,
    color: colors.primaryFont,
    lineHeight: 39,
    paddingBottom: 10,
  },
});
