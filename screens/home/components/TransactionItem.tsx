import { Pressable, View } from 'react-native'
import { TextTheme, ThemedText } from '../../../shared/ThemedText'
import Colors from '../../../constants/Colors'
import StyleVariables from '../../../constants/StyleVariables'
import { Assets } from '../../../constants/CommonEnums'
import { SvgIcons } from '../../../assets/images'

export default function TransactionItem() {
  return (
    <Pressable
      style={{
        height: 64,
        padding: 10,
        backgroundColor: Colors.primaryBackgroundLighter,
        borderRadius: StyleVariables.borderRadius,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      }}
    >
      <SvgIcons.Exchange.Exchange style={{ marginRight: 8 }} />
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <ThemedText theme={TextTheme.LabelText}>Stacks</ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <ThemedText
              theme={TextTheme.LabelText}
              styleOverwrite={{
                color: Colors.primaryAppColorLighter,
                marginRight: 4,
              }}
            >
              +1000
            </ThemedText>
            <ThemedText
              theme={TextTheme.CaptionText}
              styleOverwrite={{ color: Colors.secondaryFont }}
            >
              {Assets.STX}
            </ThemedText>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{ color: Colors.secondaryFont }}
          >
            Bitcoin
          </ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <ThemedText
              theme={TextTheme.CaptionText}
              styleOverwrite={{ color: Colors.error, marginRight: 4 }}
            >
              -0.000001
            </ThemedText>
            <ThemedText
              theme={TextTheme.CaptionText}
              styleOverwrite={{ color: Colors.secondaryFont }}
            >
              {Assets.BTC}
            </ThemedText>
          </View>
        </View>
      </View>
    </Pressable>
  )
}
