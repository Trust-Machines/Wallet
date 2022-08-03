import { View, Image } from 'react-native';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { ScreenContainer } from '@shared/ScreenContainer';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { en } from '../../en';
import { CommonStackScreenProps } from '../../nav-types';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { layout } from '@constants/Layout';
import { addNewWallet, importWallet, selectCurrentWalletData } from '@redux/walletSlice';
import { useNavigation } from '@react-navigation/native';
import { encrypt } from '@utils/helpers';
import { AppTextInput } from '@shared/AppTextInput';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

export function WalletLoginScreen({ route }: CommonStackScreenProps<'WalletLogin'>) {
  const dispatch = useAppDispatch();
  const [seedPhrase, setSeedPhrase] = useState<string>(
    'liar knee pioneer critic water gospel another butter like purity garment member'
  );
  const { walletLoading, wallets, currentWalletObject, newWalletLabel } = useAppSelector(
    state => state.wallet
  );
  const currentWalletData = useSelector(selectCurrentWalletData);
  const navigation = useNavigation();

  const handleNextPress = async () => {
    if (seedPhrase.length) {
      try {
        const walletType = !wallets.length ? undefined : currentWalletData?.type;

        const resultAction = await dispatch(importWallet({ seedPhrase, type: walletType }));
        const originalPromiseResult = unwrapResult(resultAction);

        // if the user doesn't have a wallet yet
        if (!wallets.length) {
          navigation.navigate('OnboardingStack', {
            screen: 'SetPassword',
            params: { seedPhrase, type: originalPromiseResult.type },
          });
        } else if (route.params?.password) {
          dispatch(
            addNewWallet({
              id: currentWalletObject.getID(),
              label: newWalletLabel,
              type: originalPromiseResult.type,
              encryptedSeed: encrypt(seedPhrase, route.params.password),
              balance: 0,
              transactions: [],
              address: '',
            })
          );

          navigation.navigate('NewWalletStack', {
            screen: 'CreateWalletSuccess',
            params: { isFirstWallet: false },
          });
        }
      } catch (err) {
        console.log('wallet import error', err);
        navigation.navigate('CommonError', { message: 'Wallet not found' });
      }
    }
  };

  return (
    <ScreenContainer
      showStars
      loading={walletLoading}
      canGoBack
      onGoBack={() => navigation.goBack()}
    >
      <Image
        style={{
          marginTop: layout.isSmallDevice ? 0 : '10%',
          alignSelf: 'center',
        }}
        source={require('@assets/images/recovery-phrase-graphics.png')}
      />
      <ThemedText theme={TextTheme.Headline2Text}>
        {en.Save_recovery_phrase_screen_title}
      </ThemedText>
      <ThemedText theme={TextTheme.BodyText} styleOverwrite={{ marginBottom: 26 }}>
        {en.Wallet_login_screen_subtitle}
      </ThemedText>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          marginBottom: '10%',
        }}
      >
        <AppTextInput
          labelText={'Secret Recovery Phrase'}
          value={seedPhrase}
          setValue={value => setSeedPhrase(value)}
          multiline
        />
        <AppButton
          onPress={handleNextPress}
          text={en.Common_next}
          theme={ButtonTheme.Primary}
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
}
