import { Pressable, StyleSheet, View } from 'react-native';
import { BuyCryptoStackScreenProps } from '../../nav-types';
import { ModalScreenContainer } from '@shared/ModalScreenContainer';
import { en } from '../../en';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { styleVariables } from '@constants/StyleVariables';
import { colors } from '@constants/Colors';
import { SvgIcons } from '@assets/images';

export function BuyCryptoModal({ navigation }: BuyCryptoStackScreenProps<'BuyCrypto'>) {
  const methods = [
    {
      title: en.Buy_crypto_moon_pay_button_text,
      icon: <SvgIcons.Logos.MoonPay />,
    },
    {
      title: en.Buy_crypto_binance_button_text,
      icon: <SvgIcons.Logos.Binance />,
    },
    {
      title: en.Buy_crypto_ramp_network_button_text,
      icon: <SvgIcons.Logos.RampNetwork />,
    },
  ];

  type MethodProps = {
    title: string;
    icon: React.ReactNode;
  };

  const Method = ({ title, icon }: MethodProps) => {
    return (
      <Pressable style={styles.methodContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {icon}
          <ThemedText theme={TextTheme.ButtonText}>{title}</ThemedText>
        </View>
        <SvgIcons.General.ExternalLink />
      </Pressable>
    );
  };

  return (
    <ModalScreenContainer title={en.Buy_crypto_modal_title}>
      <View style={{ alignItems: 'center' }}>
        <ThemedText theme={TextTheme.LabelText} styleOverwrite={{ marginBottom: 8 }}>
          {en.Buy_crypto_your_address}
        </ThemedText>
        <ThemedText theme={TextTheme.CaptionText} styleOverwrite={{ color: colors.secondaryFont }}>
          bc1qyl8k4wkahuepwwp3rlmzcqhv6cpc9ccla4
        </ThemedText>
        <AppButton
          text={en.Buy_crypto_copy_address}
          theme={ButtonTheme.Primary}
          fullWidth={false}
          onPress={() => navigation.getParent()?.goBack()}
          style={{ marginTop: 27 }}
          paddingHorizontal={30}
        />
      </View>
      <View style={{ marginTop: 27 }}>
        {methods.map(method => (
          <Method icon={method.icon} title={method.title} key={method.title} />
        ))}
      </View>
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  methodContainer: {
    borderRadius: styleVariables.borderRadius,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryBackgroundLighter,
    marginBottom: 17,
  },
});
