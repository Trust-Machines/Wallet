import { View, ActivityIndicator, Image } from 'react-native';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { ScreenContainer } from '@shared/ScreenContainer';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { colors } from '@constants/Colors';
import { en } from '../../en';
import { CommonStackScreenProps } from '../../types';
import { useState } from 'react';
import { decrypt } from '@utils/helpers';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { importWallet } from '@redux/walletSlice';
import { AppTextInput } from '@shared/AppTextInput';

export function UnlockWalletScreen({ route }: CommonStackScreenProps<'UnlockWallet'>) {
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { walletError } = useAppSelector(state => state.wallet);

  const { encryptedSeedPhrase, onValidationFinished } = route.params;
  const dispatch = useAppDispatch();

  const validatePassword = async () => {
    setLoading(true);
    // Decrypt wallet seed
    const decryptedWalletSeed = decrypt(encryptedSeedPhrase, password);
    console.log('decrypted wallet seed:', decryptedWalletSeed);

    // Import wallet with decrypted seed
    try {
      await dispatch(importWallet(decryptedWalletSeed)).unwrap();
      onValidationFinished(true, password);
    } catch (err) {
      console.log('wallet import error when unlocking wallet', err);
      onValidationFinished(false, password);
    }
    setLoading(false);
  };

  return (
    <ScreenContainer showStars>
      <Image
        source={require('@assets/images/unlock-wallet-graphics.png')}
        style={{ alignSelf: 'center', marginTop: 60 }}
      />
      <ThemedText theme={TextTheme.Headline2Text}>{en.Unlock_wallet_title}</ThemedText>
      <ThemedText theme={TextTheme.BodyText} styleOverwrite={{ marginBottom: 32 }}>
        {en.Unlock_wallet_subtitle}
      </ThemedText>
      {loading ? (
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
          <AppTextInput
            isPassword
            labelText={en.Common_password}
            value={password}
            setValue={value => setPassword(value)}
          />
          <AppButton
            onPress={validatePassword}
            text={en.Common_unlock}
            theme={password.length ? ButtonTheme.Primary : ButtonTheme.Disabled}
            fullWidth={true}
          />
        </View>
      )}
    </ScreenContainer>
  );
}
