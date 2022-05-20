import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { TextTheme, ThemedText } from "../../shared/ThemedText";
import { SendStackScreenProps } from "../../types";
import ModalScreenContainer from "../../shared/ModalScreenContainer";
import en from "../../en";
import StyleVariables from "../../constants/StyleVariables";
import Colors from "../../constants/Colors";
import { useEffect, useState } from "react";
import { safeParseFloat } from "../../utils/helpers";
import { SvgIcons } from "../../assets/images";
import Contact from "./components/Contact";
import AppButton, { ButtonTheme } from "../../shared/AppButton";

export default function SendScreen({
  navigation,
}: SendStackScreenProps<"Send">) {
  const [amount, setAmount] = useState(0);
  const [selectedContactAddress, setSelectedContantAddress] = useState<
    string | undefined
  >(undefined);
  const [addressInputValue, setAddressInputValue] = useState<string>("");

  useEffect(() => {
    if (addressInputValue) {
      setSelectedContantAddress(undefined);
    }
  }, [addressInputValue]);

  return (
    <ModalScreenContainer title={en.Common_send}>
      <ThemedText
        theme={TextTheme.LabelText}
        styleOverwrite={{
          marginTop: -6,
          marginBottom: 4,
          alignSelf: "flex-start",
        }}
      >
        {en.Common_amount}:
      </ThemedText>
      <SafeAreaView style={{ width: "100%" }}>
        <TextInput
          style={[styles.inputContainer, styles.amountInput]}
          value={amount.toString()}
          onChangeText={(value) => setAmount(safeParseFloat(value))}
          keyboardType="decimal-pad"
          keyboardAppearance="dark"
        />
      </SafeAreaView>

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
      <SafeAreaView
        style={{ width: "100%", position: "relative", marginBottom: 24 }}
      >
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
          <SvgIcons.General.Search style={{ position: "absolute", right: 0 }} />
        )}
      </SafeAreaView>
      <View style={styles.contactsHeader}>
        <ThemedText theme={TextTheme.LabelText}>
          {en.Send_screen_select_contact_label}
        </ThemedText>
        <ThemedText
          theme={TextTheme.CaptionText}
          styleOverwrite={{ color: Colors.primaryAppColorDarker }}
        >
          {en.Send_screen_add_contact_label}
        </ThemedText>
      </View>
      <Contact
        name={"Stacks Merch Shop"}
        address={"(6111...334e)"}
        selected={selectedContactAddress === "(6111...334e)"}
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
      <AppButton
        text={`${en.Common_send}${
          (selectedContactAddress || addressInputValue) && " " + en.Common_to
        } ${
          selectedContactAddress
            ? selectedContactAddress
            : addressInputValue.length
            ? addressInputValue
            : ""
        }`}
        theme={
          (selectedContactAddress || addressInputValue.length) && amount
            ? ButtonTheme.Primary
            : ButtonTheme.Disabled
        }
        fullWidth
        onPress={() => navigation.navigate("SendSuccess")}
        style={{ marginTop: "auto" }}
        marginBottom={60}
      />
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  amountInput: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 32,
    lineHeight: 39,
    color: Colors.primaryFont,
    height: 60,
  },
  searchInput: {
    fontFamily: "Inter_500Medium",
    fontSize: 18,
    lineHeight: 22,
    color: Colors.primaryFont,
    height: 40,
    paddingRight: 40,
  },
  inputContainer: {
    backgroundColor: Colors.inputBackground,
    borderRadius: StyleVariables.borderRadius,
    borderWidth: 1,
    borderColor: Colors.disabled,
    width: "100%",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  contactsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    marginBottom: 16,
  },
});
