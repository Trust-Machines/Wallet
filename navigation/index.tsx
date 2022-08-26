import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@constants/Colors';
import { StartScreen } from '@screens/onboarding/StartScreen';
import { BiometricsScreen } from '@screens/onboarding/BiometricsScreen';
import {
  BuyCryptoStackParamList,
  CommonStackParamList,
  ExchangeStackParamList,
  NewWalletStackParamList,
  OnboardingStackParamList,
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
  TransactionStackParamList,
  WalletsStackParamList,
} from './nav-types';
import { en } from '../en';
import LinkingConfiguration from './LinkingConfiguration';
import { GenerateWalletScreen } from '@screens/onboarding/GenerateWalletScreen';
import { CreateWalletSuccessScreen } from '@screens/onboarding/CreateWalletSuccessScreen';
import BottomTabBorder from '@assets/images/bottom-tab-border.svg';
import { LinearGradient } from 'expo-linear-gradient';
import { layout } from '@constants/Layout';
import { HomeScreen } from '@screens/home/HomeScreen';
import { ExchangeScreen } from '@screens/exchange/ExchangeScreen';
import { styleVariables } from '@constants/StyleVariables';
import { ExchangeSelectTokenModal } from '@screens/exchange/ExchangeSelectTokenModal';
import { PresentQrModal } from '@screens/transactions/PresentQrModal';
import { ScanQrModal } from '@screens/transactions/ScanQrModal';
import { ConfirmTransactionModal } from '@screens/transactions/ConfirmTransactionModal';
import { TransactionSuccessModal } from '@screens/transactions/TransactionSuccessModal';
import { SendScreen } from '@screens/transactions/SendScreen';
import { CollectiblesScreen } from '@screens/collectibles/CollectiblesScreen';
import { DefiBrowserScreen } from '@screens/defi/DefiBrowserScreen';
import { SettingsScreen } from '@screens/settings/SettingsScreen';
import { BuyCryptoModal } from '@screens/transactions/BuyCryptoModal';
import { WalletImportScreen } from '@screens/onboarding/WalletImportScreen';
import { SvgIcons } from '@assets/images';
import { AcceptTOSScreen } from '@screens/onboarding/AcceptTOSScreen';
import { SetPasswordScreen } from '@screens/onboarding/SetPasswordScreen';
import { UnlockWalletScreen } from '@screens/common/UnlockWalletScreen';
import { SetWalletLabelScreen } from '@screens/onboarding/SetWalletLabelScreen';
import { WalletSelectorModal } from '@screens/wallets/WalletSelectorModal';
import { AddNewWalletScreen } from '@screens/wallets/AddNewWallet';
import { EditWalletModal } from '@screens/wallets/EditWalletModal';
import { TransactionDetails } from '@screens/transaction-details/TransactionDetailsScreen';
import { CommonErrorScreen } from '@screens/common/CommonErrorScreen';
import { EditContactModal } from '@screens/transactions/EditContactModal';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

export function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={MyTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */

const Stack = createNativeStackNavigator<RootStackParamList>();
const OnboardingStack = createNativeStackNavigator<
  OnboardingStackParamList & CommonStackParamList
>();
const ExchangeStack = createNativeStackNavigator<ExchangeStackParamList>();
const BuyCryptoStack = createNativeStackNavigator<BuyCryptoStackParamList>();
const TransactionStack = createNativeStackNavigator<TransactionStackParamList>();
const WalletsStack = createNativeStackNavigator<WalletsStackParamList>();
const NewWalletStack = createNativeStackNavigator<NewWalletStackParamList>();

const getCommonScreens = (Stack: ReturnType<typeof createNativeStackNavigator>) => {
  return (
    <>
      <Stack.Screen
        name="WalletLabel"
        component={SetWalletLabelScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UnlockWallet"
        component={UnlockWalletScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateWalletSuccess"
        component={CreateWalletSuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CommonError"
        component={CommonErrorScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WalletImport"
        component={WalletImportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GenerateWallet"
        component={GenerateWalletScreen}
        options={{ headerShown: false }}
      />
    </>
  );
};

function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="OnboardingStack">
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="OnboardingStack"
        component={OnboardingStackView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewWalletStack"
        component={NewWalletStackView}
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
        name="BuyCryptoStack"
        component={BuyCryptoStackView}
        options={{
          presentation: 'containedTransparentModal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TransactionStack"
        component={TransactionStackView}
        options={{
          presentation: 'containedTransparentModal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WalletsStack"
        component={WalletsStackView}
        options={{
          presentation: 'containedTransparentModal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TransactionDetails"
        component={TransactionDetails}
        options={{
          title: en.Header_title_transaction_details,
          headerStyle: styles.header,
          headerTintColor: colors.primaryFont,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: en.Header_title_settings,
          headerStyle: styles.header,
          headerTintColor: colors.primaryFont,
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}

const OnboardingStackView = () => {
  const commonScreens = getCommonScreens(
    OnboardingStack as ReturnType<typeof createNativeStackNavigator>
  );

  return (
    <OnboardingStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <OnboardingStack.Screen
        name="Start"
        component={StartScreen}
        options={{ headerShown: false }}
      />
      <OnboardingStack.Screen
        name="Biometrics"
        component={BiometricsScreen}
        options={{ headerShown: false }}
      />
      <OnboardingStack.Screen
        name="AcceptTOS"
        component={AcceptTOSScreen}
        options={{ headerShown: false }}
      />
      <OnboardingStack.Screen
        name="SetPassword"
        component={SetPasswordScreen}
        options={{ headerShown: false }}
      />
      {commonScreens}
    </OnboardingStack.Navigator>
  );
};

const NewWalletStackView = () => {
  const commonScreens = getCommonScreens(
    NewWalletStack as ReturnType<typeof createNativeStackNavigator>
  );
  return (
    <NewWalletStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <NewWalletStack.Screen
        name="AddNewWallet"
        component={AddNewWalletScreen}
        options={{
          presentation: 'card',
        }}
      />
      {commonScreens}
    </NewWalletStack.Navigator>
  );
};

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
);

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
);

const TransactionStackView = () => (
  <TransactionStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <TransactionStack.Screen
      name="PresentQr"
      component={PresentQrModal}
      options={{
        presentation: 'card',
      }}
    />
    <TransactionStack.Screen
      name="ScanQr"
      component={ScanQrModal}
      options={{
        presentation: 'card',
      }}
    />
    <TransactionStack.Screen
      name="ConfirmTransaction"
      component={ConfirmTransactionModal}
      options={{
        presentation: 'card',
      }}
    />
    <WalletsStack.Screen
      name="UnlockWallet"
      component={UnlockWalletScreen}
      options={{ headerShown: false }}
    />
    <TransactionStack.Screen
      name="TransactionSuccess"
      component={TransactionSuccessModal}
      options={{
        presentation: 'card',
      }}
    />
    <TransactionStack.Screen
      name="CommonError"
      component={CommonErrorScreen}
      options={{ headerShown: false }}
    />
    <TransactionStack.Screen
      name="EditContact"
      component={EditContactModal}
      options={{
        presentation: 'card',
      }}
    />
  </TransactionStack.Navigator>
);

const WalletsStackView = () => (
  <WalletsStack.Navigator
    initialRouteName="WalletSelector"
    screenOptions={{
      headerShown: false,
    }}
  >
    <WalletsStack.Screen
      name="WalletSelector"
      component={WalletSelectorModal}
      options={{
        presentation: 'card',
      }}
    />
    <WalletsStack.Screen
      name="UnlockWallet"
      component={UnlockWalletScreen}
      options={{ headerShown: false }}
    />
    <WalletsStack.Screen
      name="EditWallet"
      component={EditWalletModal}
      options={{
        presentation: 'card',
      }}
    />
  </WalletsStack.Navigator>
);

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: colors.primaryAppColorLighter,
        tabBarStyle: {
          height: styleVariables.bottomTabHeight,
          marginBottom: styleVariables.bottomTabBottomOffset,
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 0,
          position: 'absolute',
          borderTopWidth: 0,
          width: layout.window.width - 20,
          marginLeft: 10,
          elevation: 0,
        },
        tabBarShowLabel: false,
        tabBarBackground: () => (
          <LinearGradient
            style={{
              alignItems: 'center',
              width: layout.isSmallDevice ? layout.window.width - 20 : layout.window.width,
            }}
            colors={[colors.primaryBackgroundLighter, '#243251']}
          >
            <BottomTabBorder
              preserveAspectRatio={layout.isSmallDevice ? 'xMinYMin' : 'xMinYMin slice'}
              width={layout.window.width - 20}
              style={{ marginLeft: layout.isSmallDevice ? 0 : -20 }}
            />
          </LinearGradient>
        ),
      }}
    >
      <BottomTab.Screen
        name="DefiBrowser"
        component={DefiBrowserScreen}
        options={({ navigation }: RootTabScreenProps<'DefiBrowser'>) => ({
          title: 'Defi Browser',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, focused }) =>
            focused ? <SvgIcons.TabBar.ActiveDefi style={styles.glow} /> : <SvgIcons.TabBar.Defi />,
          headerShown: false,
        })}
      />
      <BottomTab.Screen
        name="ExchangeTab"
        component={ExchangeScreen}
        options={({ navigation }: RootTabScreenProps<'ExchangeTab'>) => ({
          title: en.Header_title_exchange,
          headerStyle: styles.header,
          headerTintColor: colors.primaryFont,
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <SvgIcons.TabBar.ExchangeArrows style={styles.glow} />
            ) : (
              <SvgIcons.TabBar.ExchangeArrows />
            ),
        })}
      />

      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<'Home'>) => ({
          title: 'Home',
          headerShown: false,
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
                <SvgIcons.TabBar.Polygon style={styles.glow} />
              ) : (
                <SvgIcons.TabBar.PolygonOutlined style={styles.glow} />
              )}
              <SvgIcons.TabBar.Stacks style={{ position: 'absolute' }} />
            </View>
          ),
        })}
      />

      <BottomTab.Screen
        name="Transactions"
        component={SendScreen}
        options={({ navigation }: RootTabScreenProps<'Transactions'>) => ({
          title: en.Header_title_settings,
          headerShown: false,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <SvgIcons.TabBar.Transaction style={styles.glow} />
            ) : (
              <SvgIcons.TabBar.Transaction />
            ),
        })}
      />
      <BottomTab.Screen
        name="Collectibles"
        component={CollectiblesScreen}
        options={({ navigation }: RootTabScreenProps<'Collectibles'>) => ({
          title: en.Header_title_collectibles,
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <SvgIcons.TabBar.ActiveCollectibles style={styles.glow} />
            ) : (
              <SvgIcons.TabBar.Collectibles />
            ),
          headerStyle: styles.header,
          headerTintColor: colors.primaryFont,
        })}
      />
    </BottomTab.Navigator>
  );
}

const styles = StyleSheet.create({
  glow: {
    shadowColor: colors.primaryAppColorDarker,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  header: {
    backgroundColor: colors.primaryBackgroundDarker,
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    height: styleVariables.headerHeight,
  },
});
