import { Button, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { RootTabScreenProps } from '../../types';
import { en } from '../../en';
import { styleVariables } from '@constants/StyleVariables';
import { colors } from '@constants/Colors';
import { useEffect, useState } from 'react';
import { formatAddress, safeParseFloat } from '@utils/helpers';
import { SvgIcons } from '@assets/images';
import { Contact } from './components/Contact';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { ScreenContainer } from '@shared/ScreenContainer';
import { HomeHeader } from '@screens/home/components/HomeHeader';
import { AppAmountInput } from '@shared/AppAmountInput';

export function SendScreen({ navigation }: RootTabScreenProps<'Transactions'>) {
  const [amount, setAmount] = useState<string>('0');
  const [selectedContactAddress, setSelectedContantAddress] = useState<string | undefined>(
    undefined
  );
  const [addressInputValue, setAddressInputValue] = useState<string>('');

  useEffect(() => {
    if (addressInputValue) {
      setSelectedContantAddress(undefined);
    }
  }, [addressInputValue]);

  const handleSendPress = () => {
    navigation.navigate('TransactionStack', {
      screen: 'ConfirmTransaction',
      params: { address: selectedContactAddress ?? addressInputValue, amount },
    });
  };

  return (
    <ScreenContainer withTab>
      <HomeHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppAmountInput
          amount={amount}
          setAmount={value => setAmount(value)}
          labelText={`${en.Common_amount}:`}
          style={{ marginTop: 10 }}
        />
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
          {!!addressInputValue && (
            <Pressable
              onPress={() => setAddressInputValue('')}
              style={{ position: 'absolute', right: 0 }}
            >
              <SvgIcons.General.ClearSearch />
            </Pressable>
          )}
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
      <View style={{ flexDirection: 'row', paddingBottom: 40 }}>
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
          onPress={handleSendPress}
          style={{ flex: 1, marginRight: styleVariables.commonSpacing }}
        />
        <AppButton
          theme={ButtonTheme.Primary}
          text={''}
          icon={<SvgIcons.ScanQr />}
          fullWidth={false}
          onPress={() => navigation.navigate('TransactionStack', { screen: 'ScanQr' })}
          style={{ height: 48 }}
          paddingHorizontal={12}
        />
      </View>
    </ScreenContainer>
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
