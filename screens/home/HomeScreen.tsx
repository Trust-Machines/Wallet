import { useEffect } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import HomeHeader from './components/HomeHeader'
import { ScreenContainer } from '../../shared/ScreenContainer'
import { RootTabScreenProps } from '../../types'
import HomeBalance from './components/HomeBalance'
import AppButton, { ButtonTheme } from '../../shared/AppButton'
import en from '../../en'
import { TextTheme, ThemedText } from '../../shared/ThemedText'
import Colors from '../../constants/Colors'
import TransactionItem from './components/TransactionItem'
import { useAppSelector } from '../../redux/hooks'
import Layout from '../../constants/Layout'

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const wallet = useAppSelector((state) => state.wallet.currentWallet)
  useEffect(() => console.log('wallet from state', wallet), [])

  return (
    <ScreenContainer withTab>
      <HomeHeader />
      <ScrollView
        style={{
          marginTop: 11,
          width: Layout.window.width,
          marginLeft: -20,
        }}
        contentContainerStyle={{ paddingHorizontal: 20, position: 'relative' }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../../assets/images/home-chart.png')}
          style={{ position: 'absolute', right: -20 }}
        />
        <HomeBalance />
        <View style={{ flexDirection: 'row', marginTop: 18, marginBottom: 21 }}>
          <AppButton
            theme={ButtonTheme.Primary}
            text={en.Common_receive}
            style={{ flex: 1 }}
            paddingHorizontal={0}
            onPress={() =>
              navigation.navigate('ReceiveStack', {
                screen: 'ReceivePresentQr',
              })
            }
            fullWidth
          />
          <AppButton
            theme={ButtonTheme.Primary}
            text={en.Common_send}
            style={{ flex: 1, marginHorizontal: 16 }}
            onPress={() =>
              navigation.navigate('SendStack', {
                screen: 'Send',
              })
            }
            fullWidth
          />
          <AppButton
            theme={ButtonTheme.Primary}
            text={en.Common_buy}
            style={{ flex: 1 }}
            onPress={() =>
              navigation.navigate('BuyCryptoStack', {
                screen: 'BuyCrypto',
              })
            }
            fullWidth
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 16,
          }}
        >
          <ThemedText theme={TextTheme.LabelText}>
            {en.Home_your_transactions}
          </ThemedText>
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{ color: Colors.primaryAppColorDarker }}
          >
            {en.Home_view_all}
          </ThemedText>
        </View>
        <Text
          style={{
            fontFamily: 'Inter_600SemiBold',
            fontSize: 12,
            lineHeight: 15,
            color: Colors.disabled,
            marginBottom: 8,
          }}
        >
          29 April 2022
        </Text>
        <View style={{ paddingBottom: 30 }}>
          <TransactionItem />
          <TransactionItem />
          <TransactionItem />
          <TransactionItem />
          <TransactionItem />
          <TransactionItem />
          <TransactionItem />
          <TransactionItem />
          <TransactionItem />
        </View>
      </ScrollView>
    </ScreenContainer>
  )
}
