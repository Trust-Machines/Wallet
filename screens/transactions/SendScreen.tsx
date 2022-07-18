import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { SendStackScreenProps } from '../../types';
import { ModalScreenContainer } from '@shared/ModalScreenContainer';
import { en } from '../../en';
import { styleVariables } from '@constants/StyleVariables';
import { colors } from '@constants/Colors';
import { useEffect, useState } from 'react';
import { formatAddress, safeParseFloat } from '@utils/helpers';
import { SvgIcons } from '@assets/images';
import { Contact } from './components/Contact';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import useTransactionSending from '@hooks/useTransactionSending';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { getTransactions } from '@redux/transactionsSlice';
const ElectrumHelper = require('@utils/ElectrumHelper');

interface Fee {
  key: 'slow' | 'medium' | 'fast';
  label: string;
  value: number | undefined;
}

export function SendScreen({ navigation }: SendStackScreenProps<'Send'>) {
  const [amount, setAmount] = useState<string>('0');
  const [selectedContactAddress, setSelectedContantAddress] = useState<string | undefined>(
    undefined
  );
  const [addressInputValue, setAddressInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [fees, setFees] = useState<Fee[]>([
    { label: 'Low', key: 'slow', value: undefined },
    { label: 'Med', key: 'medium', value: undefined },
    { label: 'High', key: 'fast', value: undefined },
  ]);
  const [selectedFee, setSelectedFee] = useState<'slow' | 'medium' | 'fast'>('slow');
  const { walletObject } = useAppSelector(state => state.wallet);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchFees();
  }, []);

  useEffect(() => {
    if (addressInputValue) {
      setSelectedContantAddress(undefined);
    }
  }, [addressInputValue]);

  const fetchFees = async () => {
    try {
      await ElectrumHelper.waitTillConnected();
      const result = await ElectrumHelper.estimateFees();
      setFees([
        { label: 'Low', key: 'slow', value: result.slow },
        { label: 'Med', key: 'medium', value: result.medium },
        { label: 'High', key: 'fast', value: result.fast },
      ]);
    } catch (err) {
      console.log('fee error', err);
    }
  };

  const handleTransactionSending = async () => {
    setError(false);
    setLoading(true);
    const address = selectedContactAddress ?? addressInputValue;
    const result = await useTransactionSending({ address, amount, selectedFee }, walletObject);

    if (result.success && result.data) {
      // TODO
      await dispatch(getTransactions(walletObject));
      navigation.navigate('SendSuccess', result.data);
    } else {
      setError(true);
    }

    setLoading(false);
  };

  return (
    <ModalScreenContainer title={en.Common_send}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {(error || loading) && (
          <ThemedText theme={TextTheme.LabelText}>
            {loading ? 'Sending...' : 'Something went wrong, please try again'}
          </ThemedText>
        )}

        <ThemedText
          theme={TextTheme.LabelText}
          styleOverwrite={{
            marginBottom: 4,
            alignSelf: 'flex-start',
          }}
        >
          {en.Common_amount}:
        </ThemedText>
        <View>
          <TextInput
            style={[styles.inputContainer, styles.amountInput]}
            value={amount.toString()}
            onChangeText={value => setAmount(value)}
            keyboardType="decimal-pad"
            keyboardAppearance="dark"
          />
        </View>

        <ThemedText
          theme={TextTheme.LabelText}
          styleOverwrite={{
            marginTop: 20,
            marginBottom: 4,
            alignSelf: 'flex-start',
          }}
        >
          Fees:
        </ThemedText>
        <View style={{ flexDirection: 'row' }}>
          {fees.map((fee, i) => {
            return (
              <Pressable
                key={fee.key}
                onPress={() => setSelectedFee(fee.key)}
                style={{
                  flex: 1,
                  backgroundColor:
                    fee.key === selectedFee
                      ? colors.primaryAppColorDarker
                      : colors.primaryBackgroundLighter,
                  height: 33,
                  marginHorizontal: i === 1 ? 12 : 0,
                  borderRadius: styleVariables.borderRadius,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <ThemedText theme={TextTheme.CaptionText}>
                  {fee.label} {fee.value ? `(${fee.value})` : ''}
                </ThemedText>
                {!fee.value && (
                  <ActivityIndicator
                    size="small"
                    color={colors.primaryAppColorLighter}
                    style={{ marginLeft: 4 }}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
        <ThemedText
          theme={TextTheme.LabelText}
          styleOverwrite={{
            marginTop: 20,
            marginBottom: 4,
            alignSelf: 'flex-start',
          }}
        >
          Recipient address:
        </ThemedText>
        <View style={{ position: 'relative', marginBottom: 24 }}>
          <TextInput
            style={[styles.inputContainer, styles.searchInput]}
            value={addressInputValue.toString()}
            onChangeText={value => setAddressInputValue(value)}
            keyboardType="default"
            keyboardAppearance="dark"
            placeholder={en.Common_search_placeholder}
            placeholderTextColor={'rgba(248, 249, 250, 0.3)'}
          />
          {
            !!addressInputValue && (
              <Pressable
                onPress={() => setAddressInputValue('')}
                style={{ position: 'absolute', right: 0 }}
              >
                <SvgIcons.General.ClearSearch />
              </Pressable>
            )
            /*) : (
            <SvgIcons.General.Search style={{ position: 'absolute', right: 0 }} />
          )*/
          }
        </View>
        <View style={styles.contactsHeader}>
          <ThemedText theme={TextTheme.LabelText}>{en.Send_screen_select_contact_label}</ThemedText>
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{ color: colors.primaryAppColorDarker }}
          >
            {en.Send_screen_add_contact_label}
          </ThemedText>
        </View>
        <Contact
          name={'Stacks Merch Shop'}
          address={'bc1qrm74dlzvzrkc4fgkx9df0jgwm02drnktpn8gw7'}
          selected={selectedContactAddress === 'bc1qrm74dlzvzrkc4fgkx9df0jgwm02drnktpn8gw7'}
          setSelectedContantAddress={setSelectedContantAddress}
          clearAddressInputValue={() => setAddressInputValue('')}
        />
        <Contact
          name={'Katie'}
          address={'(SM2Z....TGTF4)'}
          selected={selectedContactAddress === '(SM2Z....TGTF4)'}
          setSelectedContantAddress={setSelectedContantAddress}
          clearAddressInputValue={() => setAddressInputValue('')}
        />
        <Contact
          name={'Katie'}
          address={'(SM2Z....TGTF3)'}
          selected={selectedContactAddress === '(SM2Z....TGTF3)'}
          setSelectedContantAddress={setSelectedContantAddress}
          clearAddressInputValue={() => setAddressInputValue('')}
        />
      </ScrollView>
      <AppButton
        text={`${en.Common_send}${
          (selectedContactAddress || addressInputValue) && ' ' + en.Common_to
        } ${formatAddress(
          selectedContactAddress
            ? selectedContactAddress
            : addressInputValue.length
            ? addressInputValue
            : ''
        )}`}
        theme={
          (selectedContactAddress || addressInputValue.length) && safeParseFloat(amount) > 0
            ? ButtonTheme.Primary
            : ButtonTheme.Disabled
        }
        fullWidth
        style={{ paddingBottom: 20 }}
        onPress={handleTransactionSending}
      />
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  amountInput: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 32,
    lineHeight: 39,
    color: colors.primaryFont,
    height: 60,
  },
  searchInput: {
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    lineHeight: 22,
    color: colors.primaryFont,
    height: 40,
    paddingRight: 40,
  },
  inputContainer: {
    backgroundColor: colors.inputBackground,
    borderRadius: styleVariables.borderRadius,
    borderWidth: 1,
    borderColor: colors.disabled,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  contactsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
});
