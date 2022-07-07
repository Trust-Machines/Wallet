import { ActivityIndicator, StyleSheet, TextInput, View } from "react-native";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import { QrStackScreenProps } from "../../types";
import { ModalScreenContainer } from "../../shared/ModalScreenContainer";
import { en } from "../../en";
import { AppButton, ButtonTheme } from "../../shared/AppButton";
import { colors } from "../../constants/Colors";
import { layout } from "../../constants/Layout";
import { Assets } from "../../constants/CommonEnums";
import useTransactionSending from "../../hooks/useTransactionSending";
import { useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { styleVariables } from "../../constants/StyleVariables";
import { safeParseFloat } from "../../utils/helpers";

// enum Tokens {
//   TKN1 = "TKN1",
//   TKN2 = "TKN2",
// }

// type TokenProps = {
//   token: Tokens | undefined;
// };

export function ConfirmSendModal({
  navigation,
  route,
}: QrStackScreenProps<"ConfirmSend">) {
  const { address } = route.params;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  // const [selectedToken, setSelectedToken] = useState<Tokens | undefined>(
  //   undefined
  // );
  const [amount, setAmount] = useState<string>(
    route.params.amount.length ? route.params.amount : "0"
  );
  const { walletObject } = useAppSelector((state) => state.wallet);

  const handleTransactionSending = async () => {
    setError(false);
    setLoading(true);
    const result = await useTransactionSending(
      { address, amount },
      walletObject
    );

    if (result.success && result.data) {
      navigation.navigate("TransactionSuccess", result.data);
    } else {
      setError(true);
    }

    setLoading(false);
  };

  // function Token(props: TokenProps) {
  //   function handleSelectToken() {
  //     if (props.token && props.token !== selectedToken) {
  //       setSelectedToken(Tokens[props.token]);
  //       setAmount(`30 ${props.token}`);
  //     } else {
  //       setSelectedToken(undefined);
  //       setAmount("1,000 STX");
  //     }
  //   }

  //   return (
  //     <Pressable
  //       style={[
  //         styles.tokenContainer,
  //         {
  //           backgroundColor:
  //             props.token === selectedToken
  //               ? colors.primaryAppColorDarker
  //               : colors.primaryBackgroundLighter,
  //         },
  //       ]}
  //       onPress={handleSelectToken}
  //     >
  //       <View style={styles.tokenImgPlaceholder}></View>
  //       <View>
  //         <ThemedText theme={TextTheme.LabelText}>Token Name</ThemedText>
  //         <View style={styles.tokenAmountContainer}>
  //           <ThemedText theme={TextTheme.InputText}>
  //             30&nbsp;{props.token}
  //           </ThemedText>
  //         </View>
  //       </View>
  //     </Pressable>
  //   );
  // }

  return (
    <ModalScreenContainer title={en.Qr_flow_modal_title}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          marginBottom: layout.isSmallDevice ? 0 : "10%",
        }}
      >
        <View>
          <ThemedText
            theme={TextTheme.LabelText}
            styleOverwrite={{
              marginTop: layout.isSmallDevice ? 4 : 31,
              marginBottom: 4,
              textAlign: "center",
            }}
          >
            {en.Common_send}
          </ThemedText>
          {route.params.amount.length ? (
            <ThemedText
              theme={TextTheme.Headline1Text}
              styleOverwrite={{ marginBottom: 4 }}
            >
              {amount + " " + Assets.BTC}
            </ThemedText>
          ) : (
            <TextInput
              style={[styles.inputContainer, styles.amountInput]}
              value={amount.toString()}
              onChangeText={(value) => setAmount(value)}
              keyboardType="decimal-pad"
              keyboardAppearance="dark"
            />
          )}

          <ThemedText
            theme={TextTheme.LabelText}
            styleOverwrite={{
              marginBottom: 20,
              color: colors.primaryAppColorLighter,
              textAlign: "center",
            }}
          >
            {amount.length ? "~$31.5" : ""}
          </ThemedText>
          <ThemedText
            theme={TextTheme.LabelText}
            styleOverwrite={{
              marginTop: 20,
              marginBottom: 4,
              textAlign: "center",
            }}
          >
            {en.Common_to}
          </ThemedText>
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{
              color: colors.secondaryFont,
              textAlign: "center",
            }}
          >
            {address}
          </ThemedText>
          <View style={{ marginTop: 40 }}>
            {loading ? (
              <ActivityIndicator
                size={"large"}
                color={colors.primaryAppColorLighter}
              />
            ) : error ? (
              <ThemedText
                theme={TextTheme.LabelText}
                styleOverwrite={{
                  marginTop: 20,
                  marginBottom: 4,
                  textAlign: "center",
                  color: colors.error,
                }}
              >
                Something went wrong, please try again
              </ThemedText>
            ) : null}
          </View>
          {/* <ThemedText
            theme={TextTheme.LabelText}
            styleOverwrite={{
              marginBottom: 12,
              alignSelf: "flex-start",
            }}
          >
            {en.Qr_flow_swapping_assets_label}
          </ThemedText>
          <Token token={Tokens.TKN1} />
          <Token token={Tokens.TKN2} /> */}
        </View>
        <AppButton
          text={`${en.Common_send}${
            safeParseFloat(amount) > 0 ? " " + amount + " " + Assets.BTC : ""
          }`}
          theme={
            loading || safeParseFloat(amount) <= 0
              ? ButtonTheme.Disabled
              : ButtonTheme.Primary
          }
          onPress={handleTransactionSending}
          fullWidth
        />
      </View>
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: colors.inputBackground,
    borderRadius: styleVariables.borderRadius,
    borderWidth: 1,
    borderColor: colors.disabled,
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 4,
  },
  amountInput: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 32,
    lineHeight: 39,
    color: colors.primaryFont,
    height: 60,
  },
  // tokenContainer: {
  //   borderRadius: styleVariables.borderRadius,
  //   height: 79,
  //   paddingHorizontal: 20,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   marginBottom: 16,
  // },
  // tokenImgPlaceholder: {
  //   height: 32,
  //   width: 32,
  //   borderRadius: 16,
  //   backgroundColor: "#F8F9FA",
  // },
  // tokenAmountContainer: {
  //   paddingVertical: 4,
  //   paddingHorizontal: 14,
  //   borderRadius: 50,
  //   borderWidth: 1,
  //   borderColor: colors.disabled,
  //   marginTop: 4,
  // },
});
