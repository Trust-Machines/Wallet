import { StyleSheet, Switch, View } from 'react-native';
import { colors } from '@constants/Colors';
import { styleVariables } from '@constants/StyleVariables';
import { TextTheme, ThemedText } from './ThemedText';

type SwitchProps = {
  onToggle(value: boolean): void;
  value: boolean;
  firstLineText: string;
  secondLineText?: string;
  firstLineTextColor?: string;
  secondLineTextColor?: string;
};

export function AppSwitch(props: SwitchProps) {
  return (
    <View style={styles.container}>
      <View style={{ marginRight: 16 }}>
        <ThemedText
          theme={TextTheme.BodyText}
          styleOverwrite={{
            textAlign: 'left',
            color: props.firstLineTextColor || colors.primaryFont,
          }}
        >
          {props.firstLineText}
        </ThemedText>
        {props.secondLineText && (
          <ThemedText
            theme={TextTheme.BodyText}
            styleOverwrite={{
              textAlign: 'left',
              color: props.secondLineTextColor || colors.primaryFont,
              fontFamily: 'Inter_700Bold',
            }}
          >
            {props.secondLineText}
          </ThemedText>
        )}
      </View>
      <Switch
        trackColor={{ false: '#767577', true: colors.primaryAppColorDarker }}
        thumbColor={'#FFFFFF'}
        ios_backgroundColor="#767577"
        onValueChange={props.onToggle}
        value={props.value}
        style={styles.switch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: styleVariables.borderRadius,
    padding: 16,
    backgroundColor: colors.primaryBackgroundLighter,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switch: {
    borderWidth: 1,
    borderColor: colors.disabled,
  },
});
