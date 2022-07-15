import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { styleVariables } from '@constants/StyleVariables';
import { SvgIcons } from '@assets/images';
import { useAppSelector } from '@redux/hooks';
import { formatAddress } from '@utils/helpers';

export function HomeHeader() {
  const navigation = useNavigation();
  const { address } = useAppSelector(state => state.address);
  const { currentWalletLabel } = useAppSelector(state => state.wallet);

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.innerContainer, { flex: 1, marginRight: 8, paddingHorizontal: 10 }]}
        onPress={() => navigation.navigate('WalletsStack', { screen: 'WalletSelector' })}
      >
        <SvgIcons.TabBar.Wallet />
        <Text style={styles.walletName}>{currentWalletLabel ?? formatAddress(address)} </Text>
        <Text style={styles.address}>{address.length ? `(${formatAddress(address)})` : ''}</Text>
      </Pressable>

      <Pressable
        style={[styles.innerContainer, { width: 40 }]}
        onPress={() => navigation.navigate('Settings')}
      >
        <SvgIcons.TabBar.Settings />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: styleVariables.headerHeight - styleVariables.statusBarHeight,
  },
  innerContainer: {
    backgroundColor: colors.primaryBackgroundLighter,
    height: 40,
    borderRadius: styleVariables.borderRadius,
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    lineHeight: 17,
    color: colors.primaryFont,
    textAlign: 'center',
    marginLeft: 10,
  },
  address: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.secondaryFont,
    textAlign: 'center',
  },
});
