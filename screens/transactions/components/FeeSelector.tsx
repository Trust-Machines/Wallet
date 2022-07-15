import { colors } from '@constants/Colors';
import { styleVariables } from '@constants/StyleVariables';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
const ElectrumHelper = require('@utils/ElectrumHelper');

export interface Fee {
  key: 'slow' | 'medium' | 'fast';
  label: string;
  value: number | undefined;
}

type FeeSelectorProps = {
  fees: Fee[];
  setFees(fees: Fee[]): void;
  selectedFee: 'slow' | 'medium' | 'fast';
  setSelectedFee(fee: 'slow' | 'medium' | 'fast'): void;
};

export const FeeSelector = ({ fees, setFees, selectedFee, setSelectedFee }: FeeSelectorProps) => {
  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      await ElectrumHelper.waitTillConnected();
      const result = await ElectrumHelper.estimateFees();
      setFees([
        { label: 'Low', key: 'slow', value: result.slow },
        { label: 'Med', key: 'medium', value: result.medium },
        { label: 'High', key: 'fast', value: result.fast },
      ]);
    } catch (err) {
      console.log('fee error', err);
    }
  };
  return (
    <View>
      <ThemedText
        theme={TextTheme.CaptionText}
        styleOverwrite={{
          marginTop: 20,
          marginBottom: 8,
          alignSelf: 'flex-start',
        }}
      >
        Fee:
      </ThemedText>
      <View style={{ flexDirection: 'row' }}>
        {fees.map((fee, i) => {
          return (
            <Pressable
              key={fee.key}
              onPress={() => setSelectedFee(fee.key)}
              style={{
                flex: 1,
                backgroundColor:
                  fee.key === selectedFee
                    ? colors.primaryAppColorDarker
                    : colors.primaryBackgroundLighter,
                height: 33,
                marginHorizontal: i === 1 ? 12 : 0,
                borderRadius: styleVariables.borderRadius,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <ThemedText theme={TextTheme.CaptionText}>
                {fee.label} {fee.value ? `(~${fee.value})` : ''}
              </ThemedText>
              {!fee.value && (
                <ActivityIndicator
                  size="small"
                  color={colors.primaryAppColorLighter}
                  style={{ marginLeft: 4 }}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
