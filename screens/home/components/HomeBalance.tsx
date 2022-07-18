import { Text, View } from 'react-native';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { en } from '../../../en';
import { Assets } from '@constants/CommonEnums';
import { colors } from '@constants/Colors';
import { useAppSelector } from '@redux/hooks';
import { satoshiToBitcoinString } from '@utils/helpers';

export function HomeBalance() {
  const { balance } = useAppSelector(state => state.balance);

  return (
    <View style={{ paddingBottom: 35, paddingTop: 10, alignItems: 'center' }}>
      <ThemedText
        theme={TextTheme.Headline1Text}
        styleOverwrite={{
          color: colors.primaryAppColorLighter,
        }}
      >
        {satoshiToBitcoinString(balance ?? 0)} {Assets.BTC}
      </ThemedText>
      <ThemedText
        theme={TextTheme.LabelText}
        styleOverwrite={{ color: colors.primaryAppColorDarker, marginVertical: 4 }}
      >
        $10,761.61 {Assets.USD}
      </ThemedText>
      <Text
        style={{
          fontFamily: 'Inter_600SemiBold',
          fontSize: 10,
          lineHeight: 12,
          color: colors.disabled,
        }}
      >
        {en.Home_last_updated_label}:&nbsp;5 seconds ago
      </Text>
    </View>
  );
}
