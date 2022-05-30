import { Pressable, StyleSheet, Text, View } from 'react-native'
import Colors from '../../../constants/Colors'
import { useNavigation } from '@react-navigation/native'
import StyleVariables from '../../../constants/StyleVariables'
import { SvgIcons } from '../../../assets/images'

export default function HomeHeader() {
  const navigation = useNavigation()

  const wallet = {
    name: 'My TrustMachines Wallet',
    address: '9Hvt...0a0b',
  }

  return (
    <View style={styles.container}>
      <SvgIcons.TabBar.Wallet style={{ marginLeft: -20 }} />
      <View>
        <Text style={styles.walletName}>{wallet.name}</Text>
        <Text style={styles.address}>({wallet.address})</Text>
      </View>
      <Pressable
        onPress={() => navigation.navigate('QrStack', { screen: 'PresentQr' })}
      >
        <SvgIcons.General.Qr style={{ marginRight: -20 }} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: StyleVariables.headerHeight - StyleVariables.statusBarHeight,
  },
  walletName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    lineHeight: 17,
    color: Colors.primaryFont,
    textAlign: 'center',
  },
  address: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 17,
    color: Colors.secondaryFont,
    textAlign: 'center',
  },
})
