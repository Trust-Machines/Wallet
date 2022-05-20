import { Pressable, StyleSheet, View } from "react-native";
import { BuyCryptoStackScreenProps } from "../../types";
import ModalScreenContainer from "../../shared/ModalScreenContainer";
import en from "../../en";
import AppButton, { ButtonTheme } from "../../shared/AppButton";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import StyleVariables from "../../constants/StyleVariables";
import Colors from "../../constants/Colors";
import { SvgIcons } from "../../assets/images";

export default function BuyCryptoModal({
  navigation,
}: BuyCryptoStackScreenProps<"BuyCrypto">) {
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {icon}
          <ThemedText theme={TextTheme.ButtonText}>{title}</ThemedText>
        </View>
        <SvgIcons.General.ExternalLink />
      </Pressable>
    );
  };

  return (
    <ModalScreenContainer title={en.Buy_crypto_modal_title}>
      <ThemedText
        theme={TextTheme.LabelText}
        styleOverwrite={{ marginBottom: 8 }}
      >
        {en.Buy_crypto_your_address}
      </ThemedText>
      <ThemedText
        theme={TextTheme.CaptionText}
        styleOverwrite={{ color: Colors.secondaryFont }}
      >
        bc1qyl8k4wkahuepwwp3rlmzcqhv6cpc9ccla4
      </ThemedText>
      <AppButton
        text={en.Buy_crypto_copy_address}
        theme={ButtonTheme.Primary}
        fullWidth={false}
        onPress={() => navigation.getParent()?.goBack()}
        style={{ marginBottom: 27, marginTop: 27 }}
        paddingHorizontal={30}
      />
      {methods.map((method) => (
        <Method icon={method.icon} title={method.title} key={method.title} />
      ))}
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  methodContainer: {
    borderRadius: StyleVariables.borderRadius,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.primaryBackgroundLighter,
    marginBottom: 17,
    width: "100%",
  },
});
