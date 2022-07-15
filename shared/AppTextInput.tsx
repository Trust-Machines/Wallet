import { colors } from '@constants/Colors';
import { TextInput, View, StyleSheet, ViewStyle } from 'react-native';
import { TextTheme, ThemedText } from './ThemedText';

export const AppTextInput = ({
  labelText,
  isPassword,
  style,
  value,
  setValue,
  placeholder,
}: {
  labelText: string;
  value: string;
  setValue(value: string): void;
  isPassword?: boolean;
  style?: ViewStyle;
  placeholder?: string;
}) => {
  return (
    <View style={style}>
      <ThemedText
        theme={TextTheme.CaptionText}
        styleOverwrite={{
          marginBottom: 10,
          color: colors.primaryAppColorLighter,
        }}
      >
        {labelText}
      </ThemedText>
      <View style={{ flexDirection: 'row', position: 'relative' }}>
        <TextInput
          style={[styles.inputContainer, styles.input]}
          secureTextEntry={!!isPassword}
          value={value}
          onChangeText={(val: string) => setValue(val)}
          keyboardType="default"
          keyboardAppearance="dark"
          placeholder={placeholder}
          placeholderTextColor={'rgba(248, 249, 250, 0.3)'}
        />
        {/* <ThemedText
          theme={TextTheme.NavigationText}
          styleOverwrite={{
            color: colors.secondaryFont,
            position: 'absolute',
            right: 0,
            bottom: 14,
          }}
        >
          BTC
        </ThemedText> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.disabled,
    flex: 1,
  },
  input: {
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    color: colors.primaryFont,
    lineHeight: 22,
    paddingBottom: 10,
  },
});
