import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import { SendStackScreenProps } from "../../types";
import { ModalScreenContainer } from "../../shared/ModalScreenContainer";
import { en } from "../../en";
import { styleVariables } from "../../constants/StyleVariables";
import { colors } from "../../constants/Colors";
import { useEffect, useState } from "react";
import {
  bitcoinToSatoshiInteger,
  formatAddress,
  safeParseFloat,
} from "../../utils/helpers";
import { SvgIcons } from "../../assets/images";
import { Contact } from "./components/Contact";
import { AppButton, ButtonTheme } from "../../shared/AppButton";
import { HDSegwitBech32Wallet } from "../../utils/wallets";
import { useAppSelector } from "../../redux/hooks";
const ElectrumHelper = require("../../utils/ElectrumHelper");
const bitcoin = require("bitcoinjs-lib");

export function SendScreen({ navigation }: SendStackScreenProps<"Send">) {
  const [amount, setAmount] = useState("0");
  const [selectedContactAddress, setSelectedContantAddress] = useState<
    string | undefined
  >(undefined);
  const [addressInputValue, setAddressInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const wallet = useAppSelector((state) => state.wallet.currentWallet);

  useEffect(() => {
    if (addressInputValue) {
      setSelectedContantAddress(undefined);
    }
  }, [addressInputValue]);

  const broadcast = async (tx: number) => {
    await ElectrumHelper.ping();
    await ElectrumHelper.waitTillConnected();
    const result = await wallet.broadcastTx(tx);
    if (!result) {
      console.log(`Error! Couldn't broadcast transaction`);
    }
    return result;
  };

  const handleTransactionSending = async () => {
    setLoading(true);
    setError(false);

    await wallet.fetchBalance();
    console.log("wallet balance", wallet.getBalance());

    await wallet.fetchTransactions();
    console.log("wallet transactions", wallet.getTransactions());

    const fees = await ElectrumHelper.estimateFees();
    console.log("fast tx fee", fees.fast);

    const changeAddress = await wallet.getChangeAddressAsync();
    console.log("changeAddress", changeAddress);

    console.log("utxo", wallet.getUtxo());

    const sendToAddress = selectedContactAddress ?? addressInputValue;
    const amountToSendInSats = bitcoinToSatoshiInteger(safeParseFloat(amount));

    const { tx, outputs, psbt, fee } = wallet.createTransaction(
      wallet.getUtxo(),
      [{ address: sendToAddress, value: amountToSendInSats }],
      fees.fast,
      changeAddress,
      HDSegwitBech32Wallet.defaultRBFSequence
    );

    try {
      await broadcast(tx.toHex());
      const transactionId = bitcoin.Transaction.fromHex(tx.toHex()).getId();
      console.log("Transaction ID on btc network: ", transactionId);

      if (!!transactionId) {
        console.log("transaction success");
        setError(false);
        navigation.navigate("SendSuccess", { transactionId, fee: fees.fast });
      } else {
        setError(true);
      }
    } catch (e) {
      console.log("broadcast failed", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalScreenContainer title={en.Common_send}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {(error || loading) && (
          <ThemedText theme={TextTheme.LabelText}>
            {loading ? "Sending..." : "Something went wrong, please try again"}
          </ThemedText>
        )}

        <ThemedText
          theme={TextTheme.LabelText}
          styleOverwrite={{
            marginBottom: 4,
            alignSelf: "flex-start",
          }}
        >
          {en.Common_amount}:
        </ThemedText>
        <View>
          <TextInput
            style={[styles.inputContainer, styles.amountInput]}
            value={amount.toString()}
            onChangeText={(value) => setAmount(value)}
            keyboardType="decimal-pad"
            keyboardAppearance="dark"
          />
        </View>

        <ThemedText
          theme={TextTheme.LabelText}
          styleOverwrite={{
            marginTop: 20,
            marginBottom: 4,
            alignSelf: "flex-start",
          }}
        >
          {en.Common_to}:
        </ThemedText>
        <View style={{ position: "relative", marginBottom: 24 }}>
          <TextInput
            style={[styles.inputContainer, styles.searchInput]}
            value={addressInputValue.toString()}
            onChangeText={(value) => setAddressInputValue(value)}
            keyboardType="default"
            keyboardAppearance="dark"
            placeholder={en.Common_search_placeholder}
            placeholderTextColor={"rgba(248, 249, 250, 0.3)"}
          />
          {addressInputValue ? (
            <Pressable
              onPress={() => setAddressInputValue("")}
              style={{ position: "absolute", right: 0 }}
            >
              <SvgIcons.General.ClearSearch />
            </Pressable>
          ) : (
            <SvgIcons.General.Search
              style={{ position: "absolute", right: 0 }}
            />
          )}
        </View>
        <View style={styles.contactsHeader}>
          <ThemedText theme={TextTheme.LabelText}>
            {en.Send_screen_select_contact_label}
          </ThemedText>
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{ color: colors.primaryAppColorDarker }}
          >
            {en.Send_screen_add_contact_label}
          </ThemedText>
        </View>
        <Contact
          name={"Stacks Merch Shop"}
          address={"bc1qrm74dlzvzrkc4fgkx9df0jgwm02drnktpn8gw7"}
          selected={
            selectedContactAddress ===
            "bc1qrm74dlzvzrkc4fgkx9df0jgwm02drnktpn8gw7"
          }
          setSelectedContantAddress={setSelectedContantAddress}
          clearAddressInputValue={() => setAddressInputValue("")}
        />
        <Contact
          name={"Katie"}
          address={"(SM2Z....TGTF4)"}
          selected={selectedContactAddress === "(SM2Z....TGTF4)"}
          setSelectedContantAddress={setSelectedContantAddress}
          clearAddressInputValue={() => setAddressInputValue("")}
        />
        <Contact
          name={"Katie"}
          address={"(SM2Z....TGTF3)"}
          selected={selectedContactAddress === "(SM2Z....TGTF3)"}
          setSelectedContantAddress={setSelectedContantAddress}
          clearAddressInputValue={() => setAddressInputValue("")}
        />
      </ScrollView>
      <AppButton
        text={`${en.Common_send}${
          (selectedContactAddress || addressInputValue) && " " + en.Common_to
        } ${formatAddress(
          selectedContactAddress
            ? selectedContactAddress
            : addressInputValue.length
            ? addressInputValue
            : ""
        )}`}
        theme={
          (selectedContactAddress || addressInputValue.length) &&
          safeParseFloat(amount) > 0
            ? ButtonTheme.Primary
            : ButtonTheme.Disabled
        }
        fullWidth
        style={{ paddingBottom: 20 }}
        onPress={handleTransactionSending}
      />
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  amountInput: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 32,
    lineHeight: 39,
    color: colors.primaryFont,
    height: 60,
  },
  searchInput: {
    fontFamily: "Inter_500Medium",
    fontSize: 18,
    lineHeight: 22,
    color: colors.primaryFont,
    height: 40,
    paddingRight: 40,
  },
  inputContainer: {
    backgroundColor: colors.inputBackground,
    borderRadius: styleVariables.borderRadius,
    borderWidth: 1,
    borderColor: colors.disabled,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  contactsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
});
