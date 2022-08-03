import { View, ActivityIndicator, Image } from 'react-native';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { ScreenContainer } from '@shared/ScreenContainer';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { colors } from '@constants/Colors';
import { en } from '../../en';
import { OnboardingStackScreenProps } from '../../nav-types';
import { useEffect, useState } from 'react';
import { layout } from '@constants/Layout';
import { decrypt, encrypt } from '@utils/helpers';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { addNewWallet, importWallet } from '@redux/walletSlice';
import { AppTextInput } from '@shared/AppTextInput';
import { unwrapResult } from '@reduxjs/toolkit';

export function SetPasswordScreen({
  navigation,
  route,
}: OnboardingStackScreenProps<'SetPassword'>) {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const { walletLoading, walletError, newWalletLabel, currentWalletID } = useAppSelector(
    state => state.wallet
  );
  const { seedPhrase, type } = route.params;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (passwordError) {
      setPasswordError(false);
    }
  }, [password, confirmPassword]);

  const handleNextPress = () => {
    if (password !== confirmPassword) {
      setPasswordError(true);
    } else {
      savePassword();
    }
  };

  // Encrypt and decrypt seed with password then try importing wallet to validate functionality
  const savePassword = async () => {
    if (seedPhrase.length) {
      const encryptedWalletSeed = encrypt(seedPhrase, password);
      console.log('encrypted wallet seed:', encryptedWalletSeed);

      const decryptedWalletSeed = decrypt(encryptedWalletSeed, password);
      console.log('decrypted wallet seed:', decryptedWalletSeed);

      try {
        const resultAction = await dispatch(
          importWallet({ seedPhrase: decryptedWalletSeed, type })
        );
        const originalPromiseResult = unwrapResult(resultAction);

        dispatch(
          addNewWallet({
            id: currentWalletID,
            label: newWalletLabel,
            type: originalPromiseResult.type,
            encryptedSeed: encrypt(decryptedWalletSeed, password), // encryptedWalletSeed ?
            balance: 0,
            transactions: [],
            address: '',
          })
        );

        navigation.navigate('CreateWalletSuccess', { isFirstWallet: true });
      } catch (err) {
        console.log('wallet import error', err);
      }
    }
  };

  return (
    <ScreenContainer showStars loading={walletLoading}>
      <Image
        style={{
          marginTop: layout.isSmallDevice ? 0 : '10%',
          alignSelf: 'center',
        }}
        source={require('@assets/images/enter-password-graphics.png')}
      />
      <ThemedText theme={TextTheme.Headline2Text}>{en.Set_password_title}</ThemedText>
      <ThemedText
        theme={TextTheme.LabelText}
        styleOverwrite={{ marginBottom: 26, color: colors.secondaryFont, textAlign: 'center' }}
      >
        Please make sure that you remember your password. In case of loss you’ll have to re-import
        your wallets.
      </ThemedText>
      {walletError ? (
        <ThemedText theme={TextTheme.NavigationText}>Something went wrong</ThemedText>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            marginBottom: '10%',
          }}
        >
          <View>
            <AppTextInput
              value={password}
              setValue={value => setPassword(value)}
              isPassword
              labelText={en.Common_password}
              style={{ marginBottom: 16 }}
            />
            <AppTextInput
              value={confirmPassword}
              setValue={value => setConfirmPassword(value)}
              isPassword
              labelText={en.Set_password_confirm_password}
              error={passwordError}
              errorMessage={'Error message'}
            />
          </View>

          <AppButton
            onPress={handleNextPress}
            text={en.Common_save}
            theme={
              password.length && confirmPassword.length ? ButtonTheme.Primary : ButtonTheme.Disabled
            }
            fullWidth
          />
        </View>
      )}
    </ScreenContainer>
  );
}
