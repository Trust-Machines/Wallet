import { Image, View, ViewStyle } from 'react-native';
import { TextTheme, ThemedText } from './ThemedText';
import { en } from '../en';

type ErrorProps = {
  text: string;
  style?: ViewStyle;
};

export function AppError(props: ErrorProps) {
  return (
    <View style={{ alignItems: 'center', marginBottom: 16, ...props.style }}>
      <Image source={require('@assets/images/error-graphics.png')} />
      <ThemedText theme={TextTheme.Headline2Text}>{en.Common_error}</ThemedText>
      <ThemedText theme={TextTheme.BodyText}>{props.text}</ThemedText>
    </View>
  );
}
