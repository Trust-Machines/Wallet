import { View, ActivityIndicator, Image } from 'react-native';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { ScreenContainer } from '@shared/ScreenContainer';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { colors } from '@constants/Colors';
import { en } from '../../en';
import { OnboardingStackScreenProps } from '../../types';
import { useState } from 'react';
import { layout } from '@constants/Layout';
import { decrypt, encrypt } from '@utils/helpers';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import {
  importWallet,
  setCurrentWalletLabel,
  setNewWalletLabel,
  setWallets,
} from '@redux/walletSlice';
import {
  addWalletToAsyncStorage,
  getWalletsFromAsyncStorage,
  storeCurrentWalletIdToAsyncStorage,
} from '@utils/asyncStorageHelper';
import { AppTextInput } from '@shared/AppTextInput';

export function SetPasswordScreen({
  navigation,
  route,
}: OnboardingStackScreenProps<'SetPassword'>) {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const { walletLoading, walletError, newWalletLabel, currentWalletID } = useAppSelector(
    state => state.wallet
  );

  const { seedPhrase } = route.params;
  const dispatch = useAppDispatch();

  // Encrypt and decrypt seed with password then try importing wallet to validate functionality
  const handleSavePassword = async () => {
    if (seedPhrase.length) {
      const encryptedWalletSeed = encrypt(seedPhrase, password);
      console.log('encrypted wallet seed:', encryptedWalletSeed);

      const decryptedWalletSeed = decrypt(encryptedWalletSeed, password);
      console.log('decrypted wallet seed:', decryptedWalletSeed);

      try {
        await dispatch(importWallet(decryptedWalletSeed)).unwrap();
        console.log('SAVE!!!', currentWalletID, newWalletLabel);

        dispatch(setCurrentWalletLabel(newWalletLabel));
        dispatch(setNewWalletLabel(''));
        await addWalletToAsyncStorage({
          encryptedWalletSeed: encrypt(decryptedWalletSeed, password),
          walletID: currentWalletID,
          walletLabel: newWalletLabel,
          balance: 0,
          transactions: [],
          address: '',
        });
        await storeCurrentWalletIdToAsyncStorage(currentWalletID);
        const storedWallets = await getWalletsFromAsyncStorage();
        if (storedWallets) {
          dispatch(setWallets(storedWallets));
        }

        navigation.navigate('CreateWalletSuccess', { isFirstWallet: true });
      } catch (err) {
        console.log('wallet import error', err);
      }
    }
  };

  return (
    <ScreenContainer showStars>
      <Image
        style={{
          marginTop: layout.isSmallDevice ? 0 : '10%',
          alignSelf: 'center',
        }}
        source={require('@assets/images/enter-password-graphics.png')}
      />
      <ThemedText theme={TextTheme.Headline2Text}>{en.Set_password_title}</ThemedText>
      <ThemedText theme={TextTheme.BodyText} styleOverwrite={{ marginBottom: 26 }}>
        {en.Set_password_subtitle}
      </ThemedText>
      {walletLoading ? (
        <ActivityIndicator
          size={'large'}
          color={colors.primaryAppColorLighter}
          style={{ marginTop: '25%' }}
        />
      ) : walletError ? (
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
              setValue={setPassword}
              isPassword
              labelText={en.Common_password}
              style={{ marginBottom: 16 }}
            />
            <AppTextInput
              value={confirmPassword}
              setValue={setConfirmPassword}
              isPassword
              labelText={en.Set_password_confirm_password}
            />
          </View>

          <AppButton
            onPress={handleSavePassword}
            text={en.Common_save}
            theme={
              password.length && password === confirmPassword
                ? ButtonTheme.Primary
                : ButtonTheme.Disabled
            }
            fullWidth={true}
          />
        </View>
      )}
    </ScreenContainer>
  );
}
