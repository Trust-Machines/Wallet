import { View, Image } from 'react-native';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { ScreenContainer } from '@shared/ScreenContainer';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { en } from '../../en';
import { CommonStackScreenProps } from '../../types';
import { useState } from 'react';
import { layout } from '@constants/Layout';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { setNewWalletLabel } from '@redux/walletSlice';
import { useNavigation } from '@react-navigation/native';
import { AppTextInput } from '@shared/AppTextInput';

export function SetWalletLabelScreen({ route }: CommonStackScreenProps<'WalletLabel'>) {
  const [label, setLabel] = useState<string>('');
  const { wallets, currentWalletID } = useAppSelector(state => state.wallet);

  const dispatch = useAppDispatch();
  const { flow } = route.params;
  const navigation = useNavigation();

  const saveLabel = async () => {
    if (label.length) {
      dispatch(setNewWalletLabel(label));

      // if user is logged in to a wallet
      if (Object.keys(wallets).length) {
        navigation.navigate('NewWalletStack', {
          screen: 'UnlockWallet',
          params: {
            // the current encrypted seed is used to validate the password
            encryptedSeedPhrase: wallets[currentWalletID].seed,
            onValidationFinished: (success: boolean, password: string) => {
              if (success) {
                navigation.navigate('NewWalletStack', {
                  screen: flow === 'generate' ? 'SaveRecoveryPhrase' : 'WalletLogin',
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
          screen: flow === 'generate' ? 'SaveRecoveryPhrase' : 'WalletLogin',
          params: {},
        });
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
