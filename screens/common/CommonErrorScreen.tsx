import { AppButton, ButtonTheme } from '@shared/AppButton';
import { ScreenContainer } from '@shared/ScreenContainer';
import { en } from '../../en';
import { CommonStackScreenProps } from '../../navigation/nav-types';
import { AppError } from '@shared/AppError';
import { View } from 'react-native';
import { layout } from '@constants/Layout';
import { useNavigation } from '@react-navigation/native';

export function CommonErrorScreen({ route }: CommonStackScreenProps<'CommonError'>) {
  const navigation = useNavigation();

  const handleButtonPress = () => {
    if (!!route.params?.onButtonPress) {
      route.params.onButtonPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <ScreenContainer
      showStars
      styles={{
        justifyContent: 'space-between',
        marginBottom: '10%',
      }}
    >
      <View>
        <AppError
          text={route.params?.message ?? ''}
          style={{ marginTop: layout.isSmallDevice ? 0 : '10%' }}
        />
      </View>
      <AppButton
        onPress={handleButtonPress}
        text={en.Common_try_again}
        theme={ButtonTheme.Primary}
        fullWidth={true}
      />
    </ScreenContainer>
  );
}
