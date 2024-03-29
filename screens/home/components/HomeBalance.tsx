import { Text, View } from 'react-native';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { en } from '../../../en';
import { Assets } from '@constants/CommonEnums';
import { colors } from '@constants/Colors';
import { satoshiToBitcoinString, timestampToDate } from '@utils/helpers';
import { useSelector } from 'react-redux';
import { selectCurrentWalletData } from '@redux/walletSlice';
import { useAppSelector } from '@redux/hooks';

export function HomeBalance() {
  const currentWalletData = useSelector(selectCurrentWalletData);
  const { usdPrice, updatedAt } = useAppSelector(state => state.wallet);

  return (
    <View style={{ paddingBottom: 35, paddingTop: 10, alignItems: 'center' }}>
      <ThemedText
        theme={TextTheme.Headline1Text}
        styleOverwrite={{
          color: colors.primaryAppColorLighter,
        }}
      >
        {satoshiToBitcoinString(currentWalletData?.balance ?? 0)} {Assets.BTC}
      </ThemedText>
      <ThemedText
        theme={TextTheme.LabelText}
        styleOverwrite={{ color: colors.primaryAppColorDarker, marginVertical: 4 }}
      >
        ${(usdPrice * (currentWalletData ? currentWalletData?.balance : 0)).toFixed(2)} {Assets.USD}
      </ThemedText>
      <Text
        style={{
          fontFamily: 'Inter_600SemiBold',
          fontSize: 10,
          lineHeight: 12,
          color: colors.disabled,
        }}
      >
        {en.Home_last_updated_label}:&nbsp;{updatedAt ? timestampToDate(updatedAt) : ''}
      </Text>
    </View>
  );
}
