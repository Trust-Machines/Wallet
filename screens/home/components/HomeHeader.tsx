import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { styleVariables } from "../../../constants/StyleVariables";
import { SvgIcons } from "../../../assets/images";
import { useAppSelector } from "../../../redux/hooks";
import { formatAddress } from "../../../utils/helpers";

export function HomeHeader() {
  const navigation = useNavigation();
  const { value, loading, error } = useAppSelector(
    (state) => state.wallet.currentWalletAddress
  );

  return (
    <View style={styles.container}>
      <SvgIcons.TabBar.Wallet style={{ marginLeft: -20 }} />
      <View>
        <Text style={styles.walletName}>My TrustMachines Wallet</Text>
        <Text style={styles.address}>
          {loading ? "" : `${formatAddress(value)}`}
        </Text>
      </View>
      <Pressable
        onPress={() => navigation.navigate("QrStack", { screen: "PresentQr" })}
      >
        <SvgIcons.General.Qr style={{ marginRight: -20 }} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: styleVariables.headerHeight - styleVariables.statusBarHeight,
  },
  walletName: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    lineHeight: 17,
    color: colors.primaryFont,
    textAlign: "center",
  },
  address: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 17,
    color: colors.secondaryFont,
    textAlign: "center",
  },
});
