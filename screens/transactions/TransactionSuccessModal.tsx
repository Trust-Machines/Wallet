import { Image, ScrollView, StyleSheet, View } from "react-native";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import { QrStackScreenProps } from "../../types";
import { ModalScreenContainer } from "../../shared/ModalScreenContainer";
import { en } from "../../en";
import { AppButton, ButtonTheme } from "../../shared/AppButton";
import { styleVariables } from "../../constants/StyleVariables";
import { colors } from "../../constants/Colors";

export function TransactionSuccessModal({
  navigation,
}: QrStackScreenProps<"TransactionSuccess">) {
  return (
    <ModalScreenContainer title={en.Qr_flow_modal_title}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText
          theme={TextTheme.Headline2Text}
          styleOverwrite={{ paddingHorizontal: 20 }}
        >
          {en.Qr_flow_transaction_success_title}
        </ThemedText>
        <Image
          source={require("../../assets/images/success-graphics.png")}
          style={{ alignSelf: "center" }}
        />

        <View style={styles.technicalDetailsContainer}>
          <View style={styles.stretchContainer}>
            <ThemedText
              theme={TextTheme.DetailText}
              styleOverwrite={{ color: colors.secondaryFont }}
            >
              Fee
            </ThemedText>
            <ThemedText theme={TextTheme.LabelText}>2 STX</ThemedText>
          </View>

          <View style={styles.stretchContainer}>
            <ThemedText
              theme={TextTheme.DetailText}
              styleOverwrite={{ color: colors.secondaryFont }}
            >
              Transaction Hash
            </ThemedText>
            <ThemedText theme={TextTheme.LabelText}>
              611ea15f45311bd...
            </ThemedText>
          </View>

          <View style={styles.stretchContainer}>
            <ThemedText
              theme={TextTheme.DetailText}
              styleOverwrite={{ color: colors.secondaryFont }}
            >
              Block
            </ThemedText>
            <ThemedText theme={TextTheme.LabelText}>224884</ThemedText>
          </View>

          <View style={styles.stretchContainer}>
            <ThemedText
              theme={TextTheme.DetailText}
              styleOverwrite={{ color: colors.secondaryFont }}
            >
              Network
            </ThemedText>
            <ThemedText theme={TextTheme.LabelText}>Bitcoin Mainnet</ThemedText>
          </View>
        </View>
      </ScrollView>
      <AppButton
        text={en.Common_done}
        theme={ButtonTheme.Primary}
        onPress={() => navigation.getParent()?.goBack()}
        fullWidth
        style={{ marginBottom: 20 }}
      />
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  stretchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  technicalDetailsContainer: {
    backgroundColor: colors.inputBackground,
    borderRadius: styleVariables.borderRadius,
    borderWidth: 1,
    borderColor: colors.disabled,
    paddingTop: 20,
    paddingLeft: 14,
    paddingRight: 14,
    width: "100%",
    marginBottom: 23,
    marginTop: 8,
  },
});
