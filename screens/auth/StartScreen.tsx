import { useEffect } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import AppButton, { ButtonTheme } from '../../shared/AppButton'
import { ScreenContainer } from '../../shared/ScreenContainer'
import { TextTheme, ThemedText } from '../../shared/ThemedText'
import Colors from '../../constants/Colors'
import en from '../../en'
import { RootStackScreenProps } from '../../types'
import Layout from '../../constants/Layout'
const ElectrumHelper = require('../../utils/ElectrumHelper')

export default function StartScreen({
  navigation,
}: RootStackScreenProps<'Start'>) {
  useEffect(() => {
    initializeElectrumHelper()
  }, [])

  const initializeElectrumHelper = async () => {
    await ElectrumHelper.connectMain()
  }

  return (
    <ScreenContainer
      showStars
      styles={{
        justifyContent: 'space-between',
        marginBottom: Layout.isSmallDevice ? '5%' : '10%',
      }}
    >
      <View>
        <Image
          source={require('../../assets/images/start-screen-graphics.png')}
          style={{
            marginTop: Layout.isSmallDevice ? '0%' : '20%',
            alignSelf: 'center',
          }}
        />
        <ThemedText theme={TextTheme.Headline2Text}>
          <ThemedText
            theme={TextTheme.Headline2Text}
            style={{ color: Colors.primaryAppColorLighter }}
          >
            {en.Wallet_name}&nbsp;
          </ThemedText>
          {en.Start_screen_title}
        </ThemedText>
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          onPress={() => navigation.navigate('Biometrics')}
          text={en.Create_new_wallet_button_text}
          theme={ButtonTheme.Primary}
          fullWidth
          marginBottom={9}
        />
        <AppButton
          onPress={() => navigation.navigate('WalletLogin')}
          text={en.User_has_wallet_button_text}
          theme={ButtonTheme.NoBorder}
          fullWidth
        />
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 'auto',
  },
})
