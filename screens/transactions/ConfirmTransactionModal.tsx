import { Image, StyleSheet, View } from 'react-native';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { TransactionStackScreenProps } from '../../navigation/nav-types';
import { ModalScreenContainer } from '@shared/ModalScreenContainer';
import { en } from '../../en';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { colors } from '@constants/Colors';
import { layout } from '@constants/Layout';
import { Assets } from '@constants/CommonEnums';
import useTransactionSending from '@hooks/useTransactionSending';
import { useState } from 'react';
import { useAppSelector } from '@redux/hooks';
import { styleVariables } from '@constants/StyleVariables';
import { safeParseFloat } from '@utils/helpers';
import { Fee, FeeSelector } from './components/FeeSelector';
import { AppAmountInput } from '@shared/AppAmountInput';
import { useSelector } from 'react-redux';
import { selectCurrentWalletData } from '@redux/walletSlice';
import { mapSeedToEncryptedSeed } from '@utils/mappers';
import { useNavigation } from '@react-navigation/native';

export function ConfirmTransactionModal({
  navigation,
  route,
}: TransactionStackScreenProps<'ConfirmTransaction'>) {
  const { address } = route.params;
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>(
    route.params.amount.length ? route.params.amount : '0'
  );
  const [fees, setFees] = useState<Fee[]>([
    { label: 'Low', key: 'slow', value: undefined },
    { label: 'Med', key: 'medium', value: undefined },
    { label: 'High', key: 'fast', value: undefined },
  ]);
  const [selectedFee, setSelectedFee] = useState<'slow' | 'medium' | 'fast'>('slow');
  const { currentWalletObject } = useAppSelector(state => state.wallet);
  const currentWalletData = useSelector(selectCurrentWalletData);
  const nav = useNavigation();

  const handleTransactionSending = async () => {
    if (currentWalletData) {
      setLoading(true);
      navigation.navigate('UnlockWallet', {
        encryptedSeedPhrase: mapSeedToEncryptedSeed(currentWalletData.encryptedSeed),
        onValidationFinished: async (success: boolean) => {
          if (success) {
            navigation.pop();

            const result = await useTransactionSending(
              { address, amount, selectedFee },
              currentWalletObject
            );

            if (result.success && result.data) {
              navigation.navigate('TransactionSuccess', result.data);
            } else {
              navigation.navigate('CommonError', {
                message: 'Please try again!',
                onButtonPress: () => nav.navigate('Root', { screen: 'Transactions' }),
              });
            }
          } else {
            console.log('error');
          }
          setLoading(false);
        },
      });
    }
  };

  return (
    <ModalScreenContainer title={'Confirm Transaction'} loading={loading}>
      <View
        style={{
          flex: 1,
          marginBottom: layout.isSmallDevice ? 0 : '10%',
          marginTop: -36,
        }}
      >
        <Image
          style={{
            alignSelf: 'center',
          }}
          source={require('@assets/images/confirm-transaction-graphics.png')}
        />
        <View>
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{
              marginBottom: 8,
            }}
          >
            Transaction Details:
          </ThemedText>

          <View style={styles.detailsContainer}>
            {route.params.amount.length ? (
              <>
                <ThemedText
                  theme={TextTheme.LabelText}
                  styleOverwrite={{
                    color: colors.primaryAppColorLighter,
                    marginBottom: 10,
                  }}
                >
                  {en.Common_amount}:
                </ThemedText>
                <ThemedText
                  theme={TextTheme.Headline1Text}
                  styleOverwrite={{
                    marginBottom: 4,
                    fontSize: 32,
                    color: colors.primaryFont,
                    lineHeight: 39,
                    textAlign: 'left',
                  }}
                >
                  {amount + ' ' + Assets.BTC}
                </ThemedText>
              </>
            ) : (
              <AppAmountInput
                labelText={'Amount:'}
                amount={amount}
                setAmount={value => setAmount(value)}
              />
            )}
            <ThemedText
              theme={TextTheme.LabelText}
              styleOverwrite={{
                marginTop: 16,
                marginBottom: 10,
                color: colors.primaryAppColorLighter,
              }}
            >
              {en.Common_to}:
            </ThemedText>
            <ThemedText
              theme={TextTheme.CaptionText}
              numberOfLines={1}
              ellipsizeMode={'middle'}
              styleOverwrite={{
                color: colors.secondaryFont,
                flexShrink: 1,
              }}
            >
              {address}
            </ThemedText>
          </View>

          <FeeSelector
            fees={fees}
            setFees={setFees}
            selectedFee={selectedFee}
            setSelectedFee={setSelectedFee}
          />
        </View>

        <AppButton
          text={`${en.Common_send}${
            safeParseFloat(amount) > 0 ? ' ' + amount + ' ' + Assets.BTC : ''
          }`}
          theme={
            loading || safeParseFloat(amount) <= 0 ? ButtonTheme.Disabled : ButtonTheme.Primary
          }
          onPress={handleTransactionSending}
          fullWidth
          style={{ marginTop: 'auto' }}
        />
      </View>
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    backgroundColor: colors.inputBackground,
    borderRadius: styleVariables.borderRadius,
    borderWidth: 1,
    borderColor: colors.disabled,
    padding: 16,
  },
});
