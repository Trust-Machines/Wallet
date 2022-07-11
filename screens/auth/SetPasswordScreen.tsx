import { View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { ScreenContainer } from '@shared/ScreenContainer';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { colors } from '@constants/Colors';
import { en } from '../../en';
import { OnboardingStackScreenProps } from '../../types';
import { styleVariables } from '@constants/StyleVariables';
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
      <ThemedText
        theme={TextTheme.Headline2Text}
        styleOverwrite={{ marginTop: layout.isSmallDevice ? 10 : 60 }}
      >
        {en.Set_password_title}
      </ThemedText>
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
            <ThemedText theme={TextTheme.LabelText} styleOverwrite={styles.inputLabel}>
              {en.Common_password}
            </ThemedText>
            <TextInput
              secureTextEntry
              value={password}
              onChangeText={(pw: string) => setPassword(pw)}
              style={styles.input}
              keyboardType="default"
              keyboardAppearance="dark"
              placeholderTextColor={'rgba(248, 249, 250, 0.3)'}
              autoFocus
            />

            <ThemedText theme={TextTheme.LabelText} styleOverwrite={styles.inputLabel}>
              {en.Set_password_confirm_password}
            </ThemedText>
            <TextInput
              secureTextEntry
              value={confirmPassword}
              onChangeText={(pw: string) => setConfirmPassword(pw)}
              style={styles.input}
              keyboardType="default"
              keyboardAppearance="dark"
              placeholderTextColor={'rgba(248, 249, 250, 0.3)'}
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

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: styleVariables.borderRadius,
    borderWidth: 1,
    borderColor: colors.disabled,
    padding: 16,
    paddingTop: 16,
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    lineHeight: 22,
    color: colors.primaryFont,
  },
  inputLabel: {
    marginBottom: 8,
    marginTop: 24,
  },
});
