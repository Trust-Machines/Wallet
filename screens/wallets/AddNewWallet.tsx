import { Image, View } from 'react-native';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { ScreenContainer } from '@shared/ScreenContainer';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { en } from '../../en';
import { NewWalletStackScreenProps } from '../../nav-types';
import { layout } from '@constants/Layout';
import { useAppSelector } from '@redux/hooks';
import { useNavigation } from '@react-navigation/native';

export function AddNewWalletScreen({ route }: NewWalletStackScreenProps<'AddNewWallet'>) {
  const { wallets } = useAppSelector(state => state.wallet);
  const navigation = useNavigation();

  const handleButtonPress = (flow: 'generate' | 'import') => {
    navigation.navigate(Object.keys(wallets).length ? 'NewWalletStack' : 'OnboardingStack', {
      screen: 'WalletLabel',
      params: { flow },
    });
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
        <ThemedText theme={TextTheme.Headline2Text}>{en.Add_new_wallet_screen_title}</ThemedText>
      </View>

      <View style={{ marginTop: 'auto' }}>
        <AppButton
          onPress={() => handleButtonPress('generate')}
          text={en.Add_new_wallet_generate_button_text}
          theme={ButtonTheme.Primary}
          fullWidth
          marginBottom={9}
        />
        <AppButton
          onPress={() => handleButtonPress('import')}
          text={en.Add_new_wallet_import_button_text}
          theme={ButtonTheme.NoBorder}
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
}
