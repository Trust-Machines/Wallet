import { AppButton, ButtonTheme } from '@shared/AppButton';
import { ScreenContainer } from '@shared/ScreenContainer';
import { en } from '../../en';
import { RootStackScreenProps } from '../../nav-types';
import { AppError } from '@shared/AppError';
import { View } from 'react-native';
import { layout } from '@constants/Layout';
import { useNavigation } from '@react-navigation/native';

export function CommonErrorScreen({ route }: RootStackScreenProps<'CommonError'>) {
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
        <AppError
          text={route?.params?.message ?? ''}
          style={{ marginTop: layout.isSmallDevice ? 0 : '10%' }}
        />
      </View>
      <AppButton
        onPress={() => navigation.goBack()}
        text={en.Common_try_again}
        theme={ButtonTheme.Primary}
        fullWidth={true}
      />
    </ScreenContainer>
  );
}
