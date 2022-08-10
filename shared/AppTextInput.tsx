import { SvgIcons } from '@assets/images';
import { colors } from '@constants/Colors';
import { useState } from 'react';
import { TextInput, View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { TextTheme, ThemedText } from './ThemedText';

export const AppTextInput = ({
  labelText,
  isPassword,
  style,
  value,
  setValue,
  placeholder,
  multiline,
  error,
  errorMessage,
  clearable,
  clearError,
}: {
  labelText: string;
  value: string;
  setValue(value: string): void;
  isPassword?: boolean;
  style?: ViewStyle;
  placeholder?: string;
  multiline?: boolean;
  error?: boolean;
  errorMessage?: string;
  clearable?: boolean;
  clearError?(): void;
}) => {
  const [focused, setFocused] = useState<boolean>(false);

  const handleTextChange = (val: string) => {
    if (error && !!clearError) {
      clearError();
    }

    setValue(val);
  };

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
      <View style={{ position: 'relative' }}>
        <TextInput
          style={[
            styles.inputContainer,
            styles.input,
            {
              borderBottomColor: error
                ? colors.error
                : focused || value.length
                ? colors.primaryAppColorDarker
                : colors.disabled,
            },
          ]}
          secureTextEntry={!!isPassword}
          value={value}
          onChangeText={(val: string) => handleTextChange(val)}
          keyboardType="default"
          keyboardAppearance="dark"
          placeholder={placeholder}
          placeholderTextColor={'rgba(248, 249, 250, 0.3)'}
          textAlignVertical="top"
          multiline={multiline}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={colors.primaryAppColorDarker}
        />
        {error && errorMessage && (
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{
              color: colors.error,
            }}
          >
            {errorMessage}
          </ThemedText>
        )}
        {clearable && value.length > 0 && (
          <Pressable
            onPress={() => setValue('')}
            style={{ position: 'absolute', right: 0, bottom: 4 }}
          >
            <SvgIcons.General.ClearInput />
          </Pressable>
        )}
        {/* {clearable && value.length && (
          <Pressable
            onPress={() => setValue('')}
            style={{ position: 'absolute', right: 0, bottom: 4 }}
          >
            <SvgIcons.General.ClearInput />
          </Pressable>
        )} */}
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
  },
  input: {
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    color: colors.primaryFont,
    paddingBottom: 8,
  },
});
