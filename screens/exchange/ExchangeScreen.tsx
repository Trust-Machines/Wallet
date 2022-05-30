import { StyleSheet, View, SafeAreaView, Pressable } from 'react-native'
import { ScreenContainer } from '../../shared/ScreenContainer'
import { TextTheme, ThemedText } from '../../shared/ThemedText'
import { RootTabScreenProps } from '../../types'
import { SvgIcons } from '../../assets/images'
import en from '../../en'
import Colors from '../../constants/Colors'
import { Assets } from '../../constants/CommonEnums'
import { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import Layout from '../../constants/Layout'
import ExchangeInput from './components/ExchangeInput'
import StyleVariables from '../../constants/StyleVariables'
import AppButton, { ButtonTheme } from '../../shared/AppButton'

export default function ExchangeScreen({
  navigation,
}: RootTabScreenProps<'Home'>) {
  const [payAsset, setPayAsset] = useState(Assets.STX)
  const [payAmount, setPayAmount] = useState(0)
  const [receiveAsset, setReceiveAsset] = useState(Assets.BTC)
  const [receiveAmount, setReceiveAmount] = useState(0)

  useEffect(() => {})

  function onSwapSides(): void {
    setPayAsset(receiveAsset)
    setReceiveAsset(payAsset)
    setPayAmount(receiveAmount)
    setReceiveAmount(payAmount)
  }

  function openAssetSelectorModal(type: 'pay' | 'receive'): void {
    navigation.navigate('ExchangeStack', {
      screen: 'ExchangeSelectToken',
      params: {
        type,
        onGoBack: (type: 'pay' | 'receive', asset: Assets) => {
          if (type === 'pay') {
            setPayAsset(asset)
          } else {
            setReceiveAsset(asset)
          }
        },
      },
    })
  }

  return (
    <ScreenContainer paddingTop={0}>
      <LinearGradient
        colors={[
          Colors.primaryBackgroundDarker,
          Colors.primaryBackgroundLighter,
        ]}
        style={styles.swapBox}
      >
        <SafeAreaView style={styles.stretchContainer}>
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{ color: Colors.secondaryFont }}
          >
            {en.Exchange_screen_pay_label}
          </ThemedText>
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{ color: Colors.secondaryFont }}
          >
            {en.Common_balance}:&nbsp;
            <ThemedText theme={TextTheme.CaptionText}>
              333.3&nbsp;{' '}
              <ThemedText
                theme={TextTheme.CaptionText}
                styleOverwrite={{ color: Colors.secondaryFont }}
              >
                {payAsset}
              </ThemedText>
            </ThemedText>
          </ThemedText>
        </SafeAreaView>
        <ExchangeInput
          amount={payAmount}
          setAmount={(value) => setPayAmount(value)}
          asset={payAsset}
          openAssetSelectorModal={() => openAssetSelectorModal('pay')}
        />
      </LinearGradient>

      <View style={styles.swapBox}>
        <SafeAreaView style={styles.stretchContainer}>
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{ color: Colors.secondaryFont }}
          >
            {en.Exchange_screen_receive_label}
          </ThemedText>
        </SafeAreaView>
        <ExchangeInput
          amount={receiveAmount}
          setAmount={(value) => setReceiveAmount(value)}
          asset={receiveAsset}
          openAssetSelectorModal={() => openAssetSelectorModal('receive')}
        />
        <View style={styles.exchangeIconContainer}>
          <Pressable onPress={onSwapSides}>
            <SvgIcons.Exchange.ExchangeColored />
          </Pressable>
        </View>
      </View>

      <View style={styles.technicalDetailsContainer}>
        <View style={styles.stretchContainer}>
          <ThemedText
            theme={TextTheme.DetailText}
            styleOverwrite={{ color: Colors.secondaryFont }}
          >
            Rate
          </ThemedText>
          <ThemedText theme={TextTheme.LabelText}>
            1 STX = 0.00002728
          </ThemedText>
        </View>

        <View style={styles.stretchContainer}>
          <ThemedText
            theme={TextTheme.DetailText}
            styleOverwrite={{ color: Colors.secondaryFont }}
          >
            Slippage Tolerance
          </ThemedText>
          <ThemedText theme={TextTheme.LabelText}>1%</ThemedText>
        </View>

        <View style={styles.stretchContainer}>
          <ThemedText
            theme={TextTheme.DetailText}
            styleOverwrite={{ color: Colors.secondaryFont }}
          >
            Estimated Fees
          </ThemedText>
          <ThemedText theme={TextTheme.LabelText}>$0.19429</ThemedText>
        </View>

        <View style={styles.stretchContainer}>
          <ThemedText
            theme={TextTheme.DetailText}
            styleOverwrite={{ color: Colors.secondaryFont }}
          >
            Price Impact
          </ThemedText>
          <ThemedText
            theme={TextTheme.LabelText}
            styleOverwrite={{ color: Colors.primaryAppColorLighter }}
          >
            {'<0.01%'}
          </ThemedText>
        </View>
      </View>

      <AppButton
        text={en.Exchange_screen_button_text}
        theme={ButtonTheme.Primary}
        fullWidth
        onPress={() => console.log('Swap pressed')}
      />
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  swapBox: {
    height: 130,
    width: Layout.window.width,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 20,
    paddingRight: 20,
    position: 'relative',
    alignSelf: 'center',
  },
  stretchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  exchangeIconContainer: {
    position: 'absolute',
    width: Layout.window.width,
    alignItems: 'center',
    top: -24,
  },
  technicalDetailsContainer: {
    backgroundColor: Colors.inputBackground,
    borderRadius: StyleVariables.borderRadius,
    borderWidth: 1,
    borderColor: Colors.disabled,
    paddingTop: 20,
    paddingLeft: 14,
    paddingRight: 14,
    marginBottom: 23,
    marginTop: 8,
  },
})
