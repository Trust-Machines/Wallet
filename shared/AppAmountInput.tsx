import { colors } from '@constants/Colors';
import { safeParseFloat } from '@utils/helpers';
import { useState } from 'react';
import { TextInput, View, StyleSheet, ViewStyle } from 'react-native';
import { TextTheme, ThemedText } from './ThemedText';

export const AppAmountInput = ({
  amount,
  setAmount,
  labelText,
  style,
  error,
  errorMessage,
}: {
  amount: string;
  setAmount(value: string): void;
  labelText: string;
  style?: ViewStyle;
  error?: boolean;
  errorMessage?: string;
}) => {
  const [focused, setFocused] = useState<boolean>(false);

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
            styles.amountInput,
            {
              borderBottomColor: error
                ? colors.error
                : focused || safeParseFloat(amount) > 0
                ? colors.primaryAppColorDarker
                : colors.disabled,
            },
          ]}
          value={amount}
          onChangeText={value => setAmount(value)}
          keyboardType="decimal-pad"
          keyboardAppearance="dark"
          maxLength={12}
          placeholder={'0'}
          placeholderTextColor={colors.secondaryFont}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={colors.primaryAppColorDarker}
        />
        {error && errorMessage && (
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{
              color: colors.error,
              position: 'absolute',
              bottom: -18,
            }}
          >
            {errorMessage}
          </ThemedText>
        )}
        <ThemedText
          theme={TextTheme.NavigationText}
          styleOverwrite={{
            color: colors.secondaryFont,
            position: 'absolute',
            right: 0,
            bottom: 14,
          }}
        >
          BTC
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 1,
  },
  amountInput: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 32,
    color: colors.primaryFont,
    paddingBottom: 10,
  },
});
