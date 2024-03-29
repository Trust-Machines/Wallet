import { StyleSheet, Text, TextStyle } from 'react-native';
import { colors } from '@constants/Colors';

export enum TextTheme {
  ButtonText = 'ButtonText',
  Headline2Text = 'Headline2Text',
  Headline1Text = 'Headline1Text',
  BodyText = 'BodyText',
  InputText = 'InputText',
  CaptionText = 'CaptionText',
  LabelText = 'LabelText',
  NavigationText = 'NavigationText',
  DetailText = 'DetailText',
}

export type TextProps = Text['props'] & {
  theme: TextTheme;
  styleOverwrite?: TextStyle;
};

export function ThemedText(props: TextProps) {
  const { styleOverwrite, theme, ...otherProps } = props;

  const styles = textStyles[theme].font;

  return <Text style={[styles, { ...styleOverwrite }]} {...otherProps} />;
}

const textStyles = {
  [TextTheme.ButtonText]: StyleSheet.create({
    font: {
      fontFamily: 'Inter_700Bold',
      fontSize: 18,
      lineHeight: 22,
      color: colors.primaryFont,
    },
  }),
  [TextTheme.Headline2Text]: StyleSheet.create({
    font: {
      fontFamily: 'Inter_700Bold',
      fontSize: 28,
      lineHeight: 34,
      textAlign: 'center',
      color: colors.primaryFont,
      marginBottom: 8,
    },
  }),
  [TextTheme.Headline1Text]: StyleSheet.create({
    font: {
      fontFamily: 'Inter_700Bold',
      fontSize: 40,
      lineHeight: 48,
      textAlign: 'center',
      color: colors.primaryFont,
    },
  }),
  [TextTheme.BodyText]: StyleSheet.create({
    font: {
      fontFamily: 'Inter_500Medium',
      fontSize: 18,
      lineHeight: 22,
      textAlign: 'center',
      color: colors.secondaryFont,
    },
  }),
  [TextTheme.InputText]: StyleSheet.create({
    font: {
      fontFamily: 'Inter_500Medium',
      fontSize: 18,
      lineHeight: 22,
      color: colors.primaryFont,
    },
  }),
  [TextTheme.DetailText]: StyleSheet.create({
    font: {
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      lineHeight: 17,
      color: colors.primaryFont,
    },
  }),
  [TextTheme.CaptionText]: StyleSheet.create({
    font: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      lineHeight: 17,
      color: colors.primaryFont,
    },
  }),
  [TextTheme.LabelText]: StyleSheet.create({
    font: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 18,
      lineHeight: 22,
      color: colors.primaryFont,
    },
  }),
  [TextTheme.NavigationText]: StyleSheet.create({
    font: {
      fontFamily: 'Inter_700Bold',
      fontSize: 18,
      lineHeight: 22,
      textAlign: 'center',
      color: colors.primaryFont,
    },
  }),
};
