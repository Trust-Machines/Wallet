import { StyleSheet, View, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { ScreenContainer } from '@shared/ScreenContainer';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { RootTabScreenProps } from '../../navigation/nav-types';
import { SvgIcons } from '@assets/images';
import { en } from '../../en';
import { colors } from '@constants/Colors';
import { Assets } from '@constants/CommonEnums';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { layout } from '@constants/Layout';
import { ExchangeInput } from './components/ExchangeInput';
import { styleVariables } from '@constants/StyleVariables';
import { AppButton, ButtonTheme } from '@shared/AppButton';

export function ExchangeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const [payAsset, setPayAsset] = useState(Assets.STX);
  const [payAmount, setPayAmount] = useState(0);
  const [receiveAsset, setReceiveAsset] = useState(Assets.BTC);
  const [receiveAmount, setReceiveAmount] = useState(0);

  useEffect(() => {});

  function onSwapSides(): void {
    setPayAsset(receiveAsset);
    setReceiveAsset(payAsset);
    setPayAmount(receiveAmount);
    setReceiveAmount(payAmount);
  }

  function openAssetSelectorModal(type: 'pay' | 'receive'): void {
    navigation.navigate('ExchangeStack', {
      screen: 'ExchangeSelectToken',
      params: {
        type,
        onGoBack: (type: 'pay' | 'receive', asset: Assets) => {
          if (type === 'pay') {
            setPayAsset(asset);
          } else {
            setReceiveAsset(asset);
          }
        },
      },
    });
  }

  return (
    <ScreenContainer paddingTop={0} withTab>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: layout.window.width, marginLeft: -20 }}
      >
        <LinearGradient
          colors={[colors.primaryBackgroundDarker, colors.primaryBackgroundLighter]}
          style={styles.swapBox}
        >
          <View style={styles.stretchContainer}>
            <ThemedText
              theme={TextTheme.CaptionText}
              styleOverwrite={{ color: colors.secondaryFont }}
            >
              {en.Exchange_screen_pay_label}
            </ThemedText>
            <ThemedText
              theme={TextTheme.CaptionText}
              styleOverwrite={{ color: colors.secondaryFont }}
            >
              {en.Common_balance}:&nbsp;
              <ThemedText theme={TextTheme.CaptionText}>
                333.3&nbsp;{' '}
                <ThemedText
                  theme={TextTheme.CaptionText}
                  styleOverwrite={{ color: colors.secondaryFont }}
                >
                  {payAsset}
                </ThemedText>
              </ThemedText>
            </ThemedText>
          </View>
          <ExchangeInput
            amount={payAmount}
            setAmount={value => setPayAmount(value)}
            asset={payAsset}
            openAssetSelectorModal={() => openAssetSelectorModal('pay')}
          />
        </LinearGradient>

        <View style={styles.swapBox}>
          <SafeAreaView style={styles.stretchContainer}>
            <ThemedText
              theme={TextTheme.CaptionText}
              styleOverwrite={{ color: colors.secondaryFont }}
            >
              {en.Exchange_screen_receive_label}
            </ThemedText>
          </SafeAreaView>
          <ExchangeInput
            amount={receiveAmount}
            setAmount={value => setReceiveAmount(value)}
            asset={receiveAsset}
            openAssetSelectorModal={() => openAssetSelectorModal('receive')}
          />
          <View style={styles.exchangeIconContainer}>
            <Pressable onPress={onSwapSides}>
              <SvgIcons.Exchange.ExchangeColored />
            </Pressable>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.technicalDetailsContainer}>
            <View style={styles.stretchContainer}>
              <ThemedText
                theme={TextTheme.DetailText}
                styleOverwrite={{ color: colors.secondaryFont }}
              >
                Rate
              </ThemedText>
              <ThemedText theme={TextTheme.LabelText}>1 STX = 0.00002728</ThemedText>
            </View>

            <View style={styles.stretchContainer}>
              <ThemedText
                theme={TextTheme.DetailText}
                styleOverwrite={{ color: colors.secondaryFont }}
              >
                Slippage Tolerance
              </ThemedText>
              <ThemedText theme={TextTheme.LabelText}>1%</ThemedText>
            </View>

            <View style={styles.stretchContainer}>
              <ThemedText
                theme={TextTheme.DetailText}
                styleOverwrite={{ color: colors.secondaryFont }}
              >
                Estimated Fees
              </ThemedText>
              <ThemedText theme={TextTheme.LabelText}>$0.19429</ThemedText>
            </View>

            <View style={styles.stretchContainer}>
              <ThemedText
                theme={TextTheme.DetailText}
                styleOverwrite={{ color: colors.secondaryFont }}
              >
                Price Impact
              </ThemedText>
              <ThemedText
                theme={TextTheme.LabelText}
                styleOverwrite={{ color: colors.primaryAppColorLighter }}
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
            marginBottom={30}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  swapBox: {
    height: 130,
    width: layout.window.width,
    paddingVertical: 16,
    paddingHorizontal: 20,
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
    width: layout.window.width,
    alignItems: 'center',
    top: -24,
  },
  technicalDetailsContainer: {
    backgroundColor: colors.inputBackground,
    borderRadius: styleVariables.borderRadius,
    borderWidth: 1,
    borderColor: colors.disabled,
    paddingTop: 20,
    paddingLeft: 14,
    paddingRight: 14,
    marginBottom: 23,
    marginTop: 8,
  },
});
