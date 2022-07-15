import { ActivityIndicator, Image, View } from 'react-native';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { ScreenContainer } from '@shared/ScreenContainer';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { colors } from '@constants/Colors';
import { en } from '../../en';
import { OnboardingStackScreenProps } from '../../types';
import { layout } from '@constants/Layout';
import { useEffect, useState } from 'react';
import {
  clearAsyncStorage,
  getDataFromAsyncStorage,
  getWalletsFromAsyncStorage,
  StorageKeys,
} from '@utils/asyncStorageHelper';
import { useAppDispatch } from '@redux/hooks';
import { setCurrentWalletID, setCurrentWalletLabel, setWallets } from '@redux/walletSlice';
import { mapSeedToEncryptedSeed } from '@utils/mappers';
import { useNavigation } from '@react-navigation/native';
const ElectrumHelper = require('@utils/ElectrumHelper');

export function StartScreen({ navigation }: OnboardingStackScreenProps<'Start'>) {
  const [loading, setLoading] = useState<Boolean>(false);
  const dispatch = useAppDispatch();
  const nav = useNavigation();

  useEffect(() => {
    //clearAsyncStorage();
    setLoading(true);
    initializeElectrumHelper();
    loginWithExistingWallet();
    setLoading(false);
  }, []);

  const initializeElectrumHelper = async (): Promise<void> => {
    await ElectrumHelper.connectMain();
  };

  const loginWithExistingWallet = async (): Promise<void> => {
    await ElectrumHelper.waitTillConnected();
    const currentWalletId = await getDataFromAsyncStorage(StorageKeys.CurrentWalletId);
    console.log('currentWalletId', currentWalletId);
    let storedWallets = null;

    if (currentWalletId) {
      storedWallets = await getWalletsFromAsyncStorage();
    }
    console.log('savedWallets', storedWallets);

    // If there is a current wallet and a corresponding wallet object stored on the device
    // the user is navigated to the password screen
    if (!!storedWallets && !!currentWalletId && !!storedWallets[currentWalletId]) {
      const wallet = storedWallets[currentWalletId];
      const encryptedSeedPhrase = wallet.seed;

      dispatch(setCurrentWalletID(currentWalletId));
      dispatch(setCurrentWalletLabel(wallet.label));
      dispatch(setWallets(storedWallets));

      navigation.navigate('UnlockWallet', {
        encryptedSeedPhrase: mapSeedToEncryptedSeed(encryptedSeedPhrase),
        onValidationFinished: (success: boolean) => {
          if (success) {
            nav.navigate('Root');
          } else {
            console.log('error');
          }
        },
      });
    } else {
      // The user has no wallet saved on the device and can choose to import/create one
      console.log('NO WALLET');
    }
  };

  return (
    <ScreenContainer
      showStars
      styles={{
        marginBottom: layout.isSmallDevice ? '5%' : '10%',
      }}
    >
      <View>
        <Image
          source={require('@assets/images/start-screen-graphics.png')}
          style={{
            marginTop: layout.isSmallDevice ? '0%' : '20%',
            alignSelf: 'center',
          }}
        />
        <ThemedText theme={TextTheme.Headline2Text}>
          <ThemedText
            theme={TextTheme.Headline2Text}
            style={{ color: colors.primaryAppColorLighter }}
          >
            {en.Wallet_name}&nbsp;
          </ThemedText>
          {en.Start_screen_title}
        </ThemedText>
      </View>
      {loading ? (
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator
            size={'large'}
            color={colors.primaryAppColorLighter}
            style={{ marginTop: 40 }}
          />
        </View>
      ) : (
        <View style={{ marginTop: 'auto' }}>
          <AppButton
            onPress={() => navigation.navigate('AcceptTOS', { flow: 'generate' })}
            text={en.Generate_new_wallet_button_text}
            theme={ButtonTheme.Primary}
            fullWidth
            style={{ marginBottom: 10 }}
          />
          <AppButton
            onPress={() => navigation.navigate('AcceptTOS', { flow: 'import' })}
            text={en.Import_wallet_button_text}
            theme={ButtonTheme.NoBorder}
            fullWidth
          />
        </View>
      )}
    </ScreenContainer>
  );
}
