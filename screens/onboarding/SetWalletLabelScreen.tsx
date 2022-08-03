import { View, Image } from 'react-native';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { ScreenContainer } from '@shared/ScreenContainer';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { en } from '../../en';
import { CommonStackScreenProps } from '../../navigation/nav-types';
import { useState } from 'react';
import { layout } from '@constants/Layout';
import { useAppDispatch } from '@redux/hooks';
import { selectCurrentWalletData, selectIsLoggedIn, setNewWalletLabel } from '@redux/walletSlice';
import { useNavigation } from '@react-navigation/native';
import { AppTextInput } from '@shared/AppTextInput';
import { useSelector } from 'react-redux';

export function SetWalletLabelScreen({ route }: CommonStackScreenProps<'WalletLabel'>) {
  const [label, setLabel] = useState<string>('');
  const currentWalletData = useSelector(selectCurrentWalletData);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const dispatch = useAppDispatch();
  const { generateOrImport } = route.params;
  const navigation = useNavigation();

  const saveLabel = async () => {
    if (label.length) {
      dispatch(setNewWalletLabel(label));
      console.log('asd', isLoggedIn);

      // if user is logged in to a wallet
      if (isLoggedIn && !!currentWalletData) {
        navigation.navigate('NewWalletStack', {
          screen: 'UnlockWallet',
          params: {
            // the current encrypted seed is used to validate the password
            encryptedSeedPhrase: currentWalletData.encryptedSeed,
            onValidationFinished: (success: boolean, password: string) => {
              if (success) {
                navigation.navigate('NewWalletStack', {
                  screen: generateOrImport === 'generate' ? 'GenerateWallet' : 'WalletImport',
                  params: { password },
                });
              } else {
                console.log('error');
              }
            },
          },
        });
      } else {
        navigation.navigate('OnboardingStack', {
          screen: generateOrImport === 'generate' ? 'GenerateWallet' : 'WalletImport',
          params: {},
        });
      }
    }
  };

  return (
    <ScreenContainer showStars canGoBack onGoBack={() => navigation.goBack()}>
      <Image
        style={{
          marginTop: layout.isSmallDevice ? 0 : '10%',
          alignSelf: 'center',
        }}
        source={require('@assets/images/wallet-name-graphics.png')}
      />
      <ThemedText theme={TextTheme.Headline2Text}>{en.Set_label_title}</ThemedText>
      <ThemedText theme={TextTheme.BodyText} styleOverwrite={{ marginBottom: 26 }}>
        {en.Set_label_subtitle}
      </ThemedText>

      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          marginBottom: '10%',
        }}
      >
        <AppTextInput
          value={label}
          setValue={setLabel}
          labelText={'Wallet name'}
          placeholder={'My Bitcoin Wallet'}
        />
        <AppButton
          onPress={saveLabel}
          text={en.Common_save}
          theme={label.length ? ButtonTheme.Primary : ButtonTheme.Disabled}
          fullWidth={true}
        />
      </View>
    </ScreenContainer>
  );
}
