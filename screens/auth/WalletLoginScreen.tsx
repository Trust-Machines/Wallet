import { View, StyleSheet, TextInput, ActivityIndicator, Image } from 'react-native';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { ScreenContainer } from '@shared/ScreenContainer';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { colors } from '@constants/Colors';
import { en } from '../../en';
import { CommonStackScreenProps } from '../../types';
import { styleVariables } from '@constants/StyleVariables';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { layout } from '@constants/Layout';
import {
  importWallet,
  setCurrentWalletLabel,
  setNewWalletLabel,
  setWallets,
} from '@redux/walletSlice';
import { useNavigation } from '@react-navigation/native';
import { addWalletToAsyncStorage, getWalletsFromAsyncStorage } from '@utils/asyncStorageHelper';
import { encrypt } from '@utils/helpers';
import { AppTextInput } from '@shared/AppTextInput';

export function WalletLoginScreen({ route }: CommonStackScreenProps<'WalletLogin'>) {
  const dispatch = useAppDispatch();
  const [seedPhrase, setSeedPhrase] = useState<string>(
    'liar knee pioneer critic water gospel another butter like purity garment member'
  );
  const { walletLoading, walletError, wallets, walletObject, newWalletLabel } = useAppSelector(
    state => state.wallet
  );
  const navigation = useNavigation();

  const handleNextPress = async () => {
    if (seedPhrase.length) {
      try {
        await dispatch(importWallet(seedPhrase)).unwrap();
        // if the user doesn't have a wallet yet
        if (!Object.keys(wallets).length) {
          navigation.navigate('OnboardingStack', {
            screen: 'SetPassword',
            params: { seedPhrase },
          });
        } else if (route.params?.password) {
          await addWalletToAsyncStorage({
            encryptedWalletSeed: encrypt(seedPhrase, route.params.password),
            walletID: walletObject.getID(),
            walletLabel: newWalletLabel,
            balance: 0,
            transactions: [],
            address: '',
          });

          const storedWallets = await getWalletsFromAsyncStorage();
          if (storedWallets) {
            dispatch(setWallets(storedWallets));
          }

          navigation.navigate('NewWalletStack', {
            screen: 'CreateWalletSuccess',
            params: { isFirstWallet: false },
          });
        }
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
        source={require('@assets/images/recovery-phrase-graphics.png')}
      />
      <ThemedText theme={TextTheme.Headline2Text}>
        {en.Save_recovery_phrase_screen_title}
      </ThemedText>
      <ThemedText theme={TextTheme.BodyText} styleOverwrite={{ marginBottom: 26 }}>
        {en.Wallet_login_screen_subtitle}
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
          <AppTextInput
            labelText={'Secret Recovery Phrase'}
            value={seedPhrase}
            setValue={value => setSeedPhrase(value)}
            multiline
          />
          {/* <TextInput
            value={seedPhrase}
            onChangeText={(phrase: string) => setSeedPhrase(phrase)}
            style={styles.input}
            keyboardType="default"
            keyboardAppearance="dark"
            placeholderTextColor={'rgba(248, 249, 250, 0.3)'}
            multiline
            autoFocus
            textAlignVertical="top"
          /> */}
          <AppButton
            onPress={handleNextPress}
            text={en.Common_next}
            theme={ButtonTheme.Primary}
            fullWidth
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
    height: layout.isSmallDevice ? 236 : 336,
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    lineHeight: 22,
    color: colors.primaryFont,
    textAlignVertical: 'top',
  },
});
