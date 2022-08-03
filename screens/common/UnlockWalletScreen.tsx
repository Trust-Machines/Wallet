import { View, Image } from 'react-native';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { ScreenContainer } from '@shared/ScreenContainer';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { en } from '../../en';
import { CommonStackScreenProps } from '../../nav-types';
import { useState } from 'react';
import { decrypt } from '@utils/helpers';
import { useAppDispatch } from '@redux/hooks';
import { importWallet, selectCurrentWalletData } from '@redux/walletSlice';
import { AppTextInput } from '@shared/AppTextInput';
import { useSelector } from 'react-redux';

export function UnlockWalletScreen({ route }: CommonStackScreenProps<'UnlockWallet'>) {
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const currentWalletData = useSelector(selectCurrentWalletData);

  const { encryptedSeedPhrase, onValidationFinished } = route.params;
  const dispatch = useAppDispatch();

  const validatePassword = async () => {
    setLoading(true);
    // Decrypt wallet seed
    const decryptedWalletSeed = decrypt(encryptedSeedPhrase, password);
    const seedRegex = new RegExp('[^a-zds:]');
    console.log('decrypted wallet seed:', decryptedWalletSeed);

    if (seedRegex.test(decryptedWalletSeed) && decryptedWalletSeed.split(' ').length !== 12) {
      setPasswordError(true);
      //onValidationFinished(false, password);
    } else {
      // Import wallet with decrypted seed
      try {
        await dispatch(
          importWallet({
            seedPhrase: decryptedWalletSeed,
            type: currentWalletData?.type || undefined,
          })
        ).unwrap();
        setPassword('');
        onValidationFinished(true, password);
      } catch (err) {
        console.log('wallet import error when unlocking wallet', err);
        onValidationFinished(false, password);
      }
    }
    setLoading(false);
  };

  return (
    <ScreenContainer showStars loading={loading}>
      <Image
        source={require('@assets/images/unlock-wallet-graphics.png')}
        style={{ alignSelf: 'center', marginTop: 60 }}
      />
      <ThemedText theme={TextTheme.Headline2Text}>{en.Unlock_wallet_title}</ThemedText>
      <ThemedText theme={TextTheme.BodyText} styleOverwrite={{ marginBottom: 32 }}>
        {en.Unlock_wallet_subtitle}
      </ThemedText>
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
          error={passwordError}
          errorMessage={'Wrong password'}
          clearError={() => setPasswordError(false)}
        />
        <AppButton
          onPress={validatePassword}
          text={en.Common_unlock}
          theme={password.length ? ButtonTheme.Primary : ButtonTheme.Disabled}
          fullWidth={true}
        />
      </View>
    </ScreenContainer>
  );
}
