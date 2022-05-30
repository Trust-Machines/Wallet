import { Image, View, ViewStyle } from 'react-native'
import { TextTheme, ThemedText } from './ThemedText'
import en from '../en'

type SuccessProps = {
  text: string
  style?: ViewStyle
}

export default function AppSuccess(props: SuccessProps) {
  return (
    <View style={{ alignItems: 'center', marginBottom: 16, ...props.style }}>
      <Image source={require('../assets/images/success-graphics.png')} />
      <ThemedText theme={TextTheme.Headline2Text}>
        {en.Common_success}
      </ThemedText>
      <ThemedText theme={TextTheme.BodyText}>{props.text}</ThemedText>
    </View>
  )
}
