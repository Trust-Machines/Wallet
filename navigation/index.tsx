/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import Colors from '../constants/Colors'
import StartScreen from '../screens/auth/StartScreen'
import BiometricsScreen from '../screens/auth/BiometricsScreen'
import {
  BuyCryptoStackParamList,
  ExchangeStackParamList,
  QrStackParamList,
  ReceiveStackParamList,
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
  SendStackParamList,
} from '../types'
import en from '../en'
import LinkingConfiguration from './LinkingConfiguration'
import SaveRecoveryPhraseScreen from '../screens/auth/SaveRecoveryPhraseScreen'
import CreateWalletSuccessScreen from '../screens/auth/CreateWalletSuccessScreen'
import BottomTabBorder from '../assets/images/bottom-tab-border.svg'
import { LinearGradient } from 'expo-linear-gradient'
import Layout from '../constants/Layout'
import HomeScreen from '../screens/home/HomeScreen'
import ExchangeScreen from '../screens/exchange/ExchangeScreen'
import StyleVariables from '../constants/StyleVariables'
import ExchangeSelectTokenModal from '../screens/exchange/ExchangeSelectTokenModal'
import PresentQrModal from '../screens/transactions/PresentQrModal'
import ScanQrModal from '../screens/transactions/ScanQrModal'
import ConfirmSendModal from '../screens/transactions/ConfirmSendModal'
import TransactionSuccessModal from '../screens/transactions/TransactionSuccessModal'
import ReceivePresentQrModal from '../screens/transactions/ReceivePresentQrModal'
import SendScreen from '../screens/transactions/SendScreen'
import SendSuccessModal from '../screens/transactions/SendSuccessModal'
import CollectiblesScreen from '../screens/collectibles/CollectiblesScreen'
import DefiBrowserScreen from '../screens/defi/DefiBrowserScreen'
import SettingsScreen from '../screens/settings/SettingsScreen'
import BuyCryptoModal from '../screens/transactions/BuyCryptoModal'
import WalletLoginScreen from '../screens/auth/WalletLoginScreen'
import { SvgIcons } from '../assets/images'

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
}

export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={MyTheme}>
      <RootNavigator />
    </NavigationContainer>
  )
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>()
const ExchangeStack = createNativeStackNavigator<ExchangeStackParamList>()
const ReceiveStack = createNativeStackNavigator<ReceiveStackParamList>()
const SendStack = createNativeStackNavigator<SendStackParamList>()
const BuyCryptoStack = createNativeStackNavigator<BuyCryptoStackParamList>()
const QrStack = createNativeStackNavigator<QrStackParamList>()

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Start"
        component={StartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Biometrics"
        component={BiometricsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SaveRecoveryPhrase"
        component={SaveRecoveryPhraseScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateWalletSuccess"
        component={CreateWalletSuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WalletLogin"
        component={WalletLoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExchangeStack"
        component={ExchangeStackView}
        options={{
          presentation: 'containedTransparentModal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ReceiveStack"
        component={ReceiveStackView}
        options={{
          presentation: 'containedTransparentModal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SendStack"
        component={SendStackView}
        options={{
          presentation: 'containedTransparentModal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BuyCryptoStack"
        component={BuyCryptoStackView}
        options={{
          presentation: 'containedTransparentModal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="QrStack"
        component={QrStackView}
        options={{
          presentation: 'containedTransparentModal',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}

const ExchangeStackView = () => (
  <ExchangeStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <ExchangeStack.Screen
      name="ExchangeSelectToken"
      component={ExchangeSelectTokenModal}
      options={{
        presentation: 'card',
      }}
    />
  </ExchangeStack.Navigator>
)

const ReceiveStackView = () => (
  <ReceiveStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <ReceiveStack.Screen
      name="ReceivePresentQr"
      component={ReceivePresentQrModal}
      options={{
        presentation: 'card',
      }}
    />
  </ReceiveStack.Navigator>
)

const SendStackView = () => (
  <SendStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <SendStack.Screen
      name="Send"
      component={SendScreen}
      options={{
        presentation: 'card',
      }}
    />
    <SendStack.Screen
      name="SendSuccess"
      component={SendSuccessModal}
      options={{
        presentation: 'card',
      }}
    />
  </SendStack.Navigator>
)

const BuyCryptoStackView = () => (
  <BuyCryptoStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <BuyCryptoStack.Screen
      name="BuyCrypto"
      component={BuyCryptoModal}
      options={{
        presentation: 'card',
      }}
    />
  </BuyCryptoStack.Navigator>
)

const QrStackView = () => (
  <QrStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <QrStack.Screen
      name="PresentQr"
      component={PresentQrModal}
      options={{
        presentation: 'card',
      }}
    />
    <QrStack.Screen
      name="ScanQr"
      component={ScanQrModal}
      options={{
        presentation: 'card',
      }}
    />
    <QrStack.Screen
      name="ConfirmSend"
      component={ConfirmSendModal}
      options={{
        presentation: 'card',
      }}
    />
    <QrStack.Screen
      name="TransactionSuccess"
      component={TransactionSuccessModal}
      options={{
        presentation: 'card',
      }}
    />
  </QrStack.Navigator>
)

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>()

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors.primaryAppColorLighter,
        tabBarStyle: {
          height: StyleVariables.bottomTabHeight,
          marginBottom: StyleVariables.bottomTabBottomOffset,
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 0,
          position: 'absolute',
          borderTopWidth: 0,
          width: Layout.window.width - 20,
          marginLeft: 10,
        },
        tabBarShowLabel: false,
        tabBarBackground: () => (
          <LinearGradient
            style={{
              alignItems: 'center',
              width: Layout.window.width,
            }}
            colors={[Colors.primaryBackgroundLighter, '#243251']}
          >
            <BottomTabBorder
              preserveAspectRatio="xMinYMin slice"
              width={Layout.window.width - 20}
              style={{ marginLeft: -20 }}
            />
          </LinearGradient>
        ),
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<'Home'>) => ({
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <SvgIcons.TabBar.ActiveWallet style={styles.glow} />
            ) : (
              <SvgIcons.TabBar.Wallet />
            ),
        })}
      />
      <BottomTab.Screen
        name="Collectibles"
        component={CollectiblesScreen}
        options={({ navigation }: RootTabScreenProps<'Collectibles'>) => ({
          title: en.Header_title_collectibles,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <SvgIcons.TabBar.ActiveCollectibles style={styles.glow} />
            ) : (
              <SvgIcons.TabBar.Collectibles />
            ),
          headerStyle: styles.header,
          headerTintColor: Colors.primaryFont,
        })}
      />

      <BottomTab.Screen
        name="ExchangeTab"
        component={ExchangeScreen}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            e.preventDefault()
            navigation.navigate(navigation.isFocused() ? 'Home' : 'ExchangeTab')
          },
        })}
        options={({ navigation }: RootTabScreenProps<'ExchangeTab'>) => ({
          title: en.Header_title_exchange,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                marginTop: -40,
              }}
            >
              {focused ? (
                <>
                  <SvgIcons.TabBar.PolygonOutlined style={styles.glow} />
                  <SvgIcons.TabBar.Close style={{ position: 'absolute' }} />
                </>
              ) : (
                <>
                  <SvgIcons.TabBar.Polygon style={styles.glow} />
                  <SvgIcons.TabBar.Stacks style={{ position: 'absolute' }} />
                </>
              )}
            </View>
          ),
          headerStyle: styles.header,
          headerTintColor: Colors.primaryFont,
        })}
      />
      <BottomTab.Screen
        name="DefiBrowser"
        component={DefiBrowserScreen}
        options={({ navigation }: RootTabScreenProps<'DefiBrowser'>) => ({
          title: 'Defi Browser',
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <SvgIcons.TabBar.ActiveDefi style={styles.glow} />
            ) : (
              <SvgIcons.TabBar.Defi />
            ),
          headerShown: false,
        })}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation }: RootTabScreenProps<'Settings'>) => ({
          title: en.Header_title_settings,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <SvgIcons.TabBar.ActiveSettings style={styles.glow} />
            ) : (
              <SvgIcons.TabBar.Settings />
            ),
          headerStyle: styles.header,
          headerTintColor: Colors.primaryFont,
        })}
      />
    </BottomTab.Navigator>
  )
}

const styles = StyleSheet.create({
  glow: {
    shadowColor: Colors.primaryAppColorDarker,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  header: {
    backgroundColor: Colors.primaryBackgroundDarker,
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    height: StyleVariables.headerHeight,
  },
})
