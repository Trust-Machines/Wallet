import { colors } from '@constants/Colors';
import { TextInput, View, StyleSheet, ViewStyle } from 'react-native';
import { TextTheme, ThemedText } from './ThemedText';

export const AppAmountInput = ({
  amount,
  setAmount,
  labelText,
  style,
}: {
  amount: string;
  setAmount(value: string): void;
  labelText: string;
  style?: ViewStyle;
}) => {
  return (
    <View style={style}>
      <ThemedText
        theme={TextTheme.LabelText}
        styleOverwrite={{
          marginBottom: 10,
          color: colors.primaryAppColorLighter,
        }}
      >
        {labelText}
      </ThemedText>
      <View style={{ flexDirection: 'row', position: 'relative' }}>
        <TextInput
          style={[styles.inputContainer, styles.amountInput]}
          value={amount}
          onChangeText={value => setAmount(value)}
          keyboardType="decimal-pad"
          keyboardAppearance="dark"
          maxLength={12}
          placeholder={'0'}
          placeholderTextColor={colors.secondaryFont}
        />
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
    borderBottomColor: colors.disabled,
    flex: 1,
  },
  amountInput: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 32,
    color: colors.primaryFont,
    lineHeight: 39,
    paddingBottom: 10,
  },
});
