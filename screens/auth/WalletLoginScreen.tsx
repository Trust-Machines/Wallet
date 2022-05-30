import { View, StyleSheet, TextInput } from 'react-native'
import AppButton, { ButtonTheme } from '../../shared/AppButton'
import { ScreenContainer } from '../../shared/ScreenContainer'
import { TextTheme, ThemedText } from '../../shared/ThemedText'
import Colors from '../../constants/Colors'
import en from '../../en'
import { RootStackScreenProps } from '../../types'
import StyleVariables from '../../constants/StyleVariables'
import { useState } from 'react'
import startImport from '../../utils/wallets/wallet-import'
import { save } from './walletSlice'
import { useAppDispatch } from '../../redux/hooks'
import { saveSecurely, SecureKeys } from '../../utils/secureStore'
import Layout from '../../constants/Layout'

export default function WalletLoginScreen({
  navigation,
}: RootStackScreenProps<'WalletLogin'>) {
  const [seedPhrase, setSeedPhrase] = useState<string>(
    'guitar pattern avocado lion dizzy fiber noble scatter change vehicle lunar pluck draw fatal earth'
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const dispatch = useAppDispatch()

  const handleNextPress = () => {
    // TODO seed phrase validation
    if (seedPhrase.length) {
      setLoading(true)
      const onProgress = (data: any) => {
        console.log('onProgress', data)
      }

      const onWallet = async (wallet: any) => {
        const id = wallet.getID()
        console.log('WALLETID: ', id)
        let subtitle
        try {
          subtitle = wallet.getDerivationPath?.()

          dispatch(save(wallet))
          await saveSecurely(SecureKeys.SeedPhrase, wallet.secret)
          setLoading(false)
          navigation.navigate('Root')
          console.log('ADDRESS: ', wallet)
        } catch (e) {
          setLoading(false)
          setError(true)
          console.log('onWallet error', e)
        }

        console.log('SUBTITLE: ', subtitle)
      }

      const onPassword = () => {
        const pass = '123456' // Should prompt the user to set a password or sth
        return pass
      }

      startImport(seedPhrase, true, true, onProgress, onWallet, onPassword)
    }
  }

  return (
    <ScreenContainer showStars>
      <ThemedText
        theme={TextTheme.Headline2Text}
        styleOverwrite={{ marginTop: Layout.isSmallDevice ? 10 : 60 }}
      >
        {en.Save_recovery_phrase_screen_title}
      </ThemedText>
      <ThemedText
        theme={TextTheme.BodyText}
        styleOverwrite={{ marginBottom: 26 }}
      >
        {en.Wallet_login_screen_subtitle}
      </ThemedText>
      {loading ? (
        <ThemedText theme={TextTheme.NavigationText}>Loading...</ThemedText>
      ) : error ? (
        <ThemedText theme={TextTheme.NavigationText}>
          Something went wrong
        </ThemedText>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            marginBottom: '10%',
          }}
        >
          <TextInput
            value={seedPhrase}
            onChangeText={(phrase: string) => setSeedPhrase(phrase)}
            style={styles.input}
            keyboardType="default"
            keyboardAppearance="dark"
            placeholderTextColor={'rgba(248, 249, 250, 0.3)'}
            multiline
            autoFocus
            textAlignVertical="top"
          />
          <AppButton
            onPress={handleNextPress}
            text={en.Common_next}
            theme={ButtonTheme.Primary}
            fullWidth={true}
          />
        </View>
      )}
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.inputBackground,
    borderRadius: StyleVariables.borderRadius,
    borderWidth: 1,
    borderColor: Colors.disabled,
    padding: 16,
    paddingTop: 16,
    height: Layout.isSmallDevice ? 236 : 336,
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    lineHeight: 22,
    color: Colors.primaryFont,
    textAlignVertical: 'top',
  },
})
