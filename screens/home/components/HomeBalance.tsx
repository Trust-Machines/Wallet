import { Text, View } from 'react-native'
import { TextTheme, ThemedText } from '../../../shared/ThemedText'
import en from '../../../en'
import { Assets } from '../../../constants/CommonEnums'
import Colors from '../../../constants/Colors'

export default function HomeBalance() {
  const balance = {
    STX: '10.3K',
    USD: '10,761.61',
    change: '+3%',
    lastUpdated: '5 seconds ago',
  }

  return (
    <View style={{ height: 166, justifyContent: 'space-between' }}>
      <View>
        <ThemedText
          theme={TextTheme.CaptionText}
          styleOverwrite={{ color: Colors.secondaryFont, marginBottom: 4 }}
        >
          {en.Common_balance}
        </ThemedText>
        <View style={{ flexDirection: 'row' }}>
          <ThemedText
            theme={TextTheme.Headline2Text}
            styleOverwrite={{
              textAlign: 'left',
              marginRight: 4,
              marginBottom: 0,
            }}
          >
            {balance.STX} {Assets.STX}
          </ThemedText>
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{ color: Colors.primaryAppColorLighter }}
          >
            {balance.change}
          </ThemedText>
        </View>
        <ThemedText theme={TextTheme.LabelText}>
          ${balance.USD}&nbsp;
          <ThemedText
            theme={TextTheme.LabelText}
            styleOverwrite={{ color: Colors.secondaryFont }}
          >
            {Assets.USD}
          </ThemedText>
        </ThemedText>
      </View>
      <Text
        style={{
          fontFamily: 'Inter_600SemiBold',
          fontSize: 10,
          lineHeight: 12,
          color: Colors.disabled,
        }}
      >
        {en.Home_last_updated_label}:&nbsp;{balance.lastUpdated}
      </Text>
    </View>
  )
}
