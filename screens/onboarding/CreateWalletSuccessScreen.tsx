import { AppButton, ButtonTheme } from '@shared/AppButton';
import { ScreenContainer } from '@shared/ScreenContainer';
import { en } from '../../en';
import { CommonStackScreenProps } from '../../navigation/nav-types';
import { AppSuccess } from '@shared/AppSuccess';
import { View } from 'react-native';
import { layout } from '@constants/Layout';
import { useNavigation } from '@react-navigation/native';

export function CreateWalletSuccessScreen({
  route,
}: CommonStackScreenProps<'CreateWalletSuccess'>) {
  const navigation = useNavigation();
  return (
    <ScreenContainer
      showStars
      styles={{
        justifyContent: 'space-between',
        marginBottom: '10%',
      }}
    >
      <View>
        <AppSuccess
          text={en.Create_wallet_success_text}
          style={{ marginTop: layout.isSmallDevice ? 0 : '10%' }}
        />
      </View>
      <AppButton
        onPress={() => navigation.navigate(route.params.isFirstWallet ? 'Root' : 'WalletsStack')}
        text={en.Create_wallet_success_button_text}
        theme={ButtonTheme.Primary}
        fullWidth={true}
      />
    </ScreenContainer>
  );
}
