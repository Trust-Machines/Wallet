import { Pressable, View } from 'react-native';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { colors } from '@constants/Colors';
import { styleVariables } from '@constants/StyleVariables';
import { Assets } from '@constants/CommonEnums';
import { SvgIcons } from '@assets/images';
import { formatAddress, satoshiToBitcoinString } from '@utils/helpers';
import { useNavigation } from '@react-navigation/native';

export function TransactionItem({ transaction }: any) {
  const { value, hash } = transaction;
  console.log('TRANSACTION', transaction);
  const navigation = useNavigation();

  const address = transaction.inputs[0].addresses[0];
  const pending = transaction.confirmations < 2;
  // TODO handle failed

  const handleTransactionPress = () => {
    navigation.navigate('TransactionDetails', {
      transactionHash: transaction.hash,
    });
  };

  return (
    <Pressable
      onPress={handleTransactionPress}
      style={{
        height: 64,
        padding: 8,
        backgroundColor: colors.primaryBackgroundLighter,
        borderRadius: styleVariables.borderRadius,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      }}
      key={hash}
    >
      {pending ? (
        <SvgIcons.Transactions.Pending style={{ marginRight: 8 }} />
      ) : value > 0 ? (
        <SvgIcons.Transactions.Received style={{ marginRight: 8 }} />
      ) : (
        <SvgIcons.Transactions.Sent style={{ marginRight: 8 }} />
      )}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <ThemedText theme={TextTheme.CaptionText}>
            {pending ? 'Pending' : value > 0 ? 'Received' : 'Sent'}
          </ThemedText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}
          >
            <ThemedText
              theme={TextTheme.CaptionText}
              styleOverwrite={{
                color: value > 0 ? colors.primaryAppColorLighter : colors.primaryFont,
                marginRight: 4,
              }}
            >
              {satoshiToBitcoinString(value)} {Assets.BTC}
            </ThemedText>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{ color: colors.secondaryFont }}
          >
            {value > 0 ? 'From:' : 'To: '} {formatAddress(address)}
          </ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <ThemedText
              theme={TextTheme.CaptionText}
              styleOverwrite={{
                color: colors.primaryAppColorDarker,
                marginRight: 4,
              }}
            >
              3.5 {Assets.USD}
            </ThemedText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
