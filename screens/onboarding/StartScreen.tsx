import { Image, View } from 'react-native';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { ScreenContainer } from '@shared/ScreenContainer';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { colors } from '@constants/Colors';
import { en } from '../../en';
import { OnboardingStackScreenProps } from '../../navigation/nav-types';
import { layout } from '@constants/Layout';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@redux/hooks';
import { mapSeedToEncryptedSeed } from '@utils/mappers';
import { useNavigation } from '@react-navigation/native';
import { selectCurrentWalletData, selectIsLoggedIn } from '@redux/walletSlice';
import { useSelector } from 'react-redux';
const ElectrumHelper = require('@utils/ElectrumHelper');
import AsyncStorage from '@react-native-async-storage/async-storage';

export function StartScreen({ navigation }: OnboardingStackScreenProps<'Start'>) {
  const [loading, setLoading] = useState<boolean>(false);
  const nav = useNavigation();

  const { currentWalletID } = useAppSelector(state => state.wallet);
  const currentWalletData = useSelector(selectCurrentWalletData);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
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
    // If there is a current wallet and a corresponding wallet object stored on the device
    // the user is navigated to the password screen
    if (isLoggedIn && currentWalletID && !!currentWalletData) {
      navigation.navigate('UnlockWallet', {
        encryptedSeedPhrase: mapSeedToEncryptedSeed(currentWalletData.encryptedSeed),
        onValidationFinished: (success: boolean) => {
          if (success) {
            nav.navigate('Root');
          } else {
            nav.navigate('OnboardingStack', { screen: 'CommonError', params: {} });
            console.log('error');
          }
        },
      });
    } else {
      // The user has no wallet saved on the device and can choose to import/create one
      // TODO clear async storage?
      console.log('NO WALLET');
    }
  };

  return (
    <ScreenContainer
      showStars
      styles={{
        marginBottom: layout.isSmallDevice ? '5%' : '10%',
      }}
      loading={loading}
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
      <View style={{ marginTop: 'auto' }}>
        <AppButton
          onPress={() => navigation.navigate('AcceptTOS', { generateOrImport: 'generate' })}
          text={en.Generate_new_wallet_button_text}
          theme={ButtonTheme.Primary}
          fullWidth
          style={{ marginBottom: 10 }}
        />
        <AppButton
          onPress={() => navigation.navigate('AcceptTOS', { generateOrImport: 'import' })}
          text={en.Import_wallet_button_text}
          theme={ButtonTheme.NoBorder}
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
}
