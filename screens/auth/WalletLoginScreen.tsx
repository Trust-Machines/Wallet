import { StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native'
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

export default function WalletLoginScreen({
  navigation,
}: RootStackScreenProps<'WalletLogin'>) {
  const [seedPhrase, setSeedPhrase] = useState<string>(
    'guitar pattern avocado lion dizzy fiber noble scatter change vehicle lunar pluck draw fatal earth'
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

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
          const dispatch = useAppDispatch()
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
        styleOverwrite={{ marginTop: 60 }}
      >
        {en.Save_recovery_phrase_screen_title}
      </ThemedText>
      <ThemedText
        theme={TextTheme.BodyText}
        styleOverwrite={{ marginBottom: 26 }}
      >
        {en.Wallet_login_screen_subtitle}
      </ThemedText>
      <KeyboardAvoidingView>
        {loading ? (
          <ThemedText theme={TextTheme.NavigationText}>Loading...</ThemedText>
        ) : error ? (
          <ThemedText theme={TextTheme.NavigationText}>
            Something went wrong
          </ThemedText>
        ) : (
          <>
            <TextInput
              value={seedPhrase}
              onChangeText={(phrase: string) => setSeedPhrase(phrase)}
              style={styles.input}
              keyboardType="default"
              keyboardAppearance="dark"
              placeholderTextColor={'rgba(248, 249, 250, 0.3)'}
              multiline
              autoFocus
            />
            <AppButton
              onPress={handleNextPress}
              text={en.Common_next}
              theme={ButtonTheme.Primary}
              fullWidth={true}
              marginBottom={70}
              style={{ marginTop: 'auto' }}
            />
          </>
        )}
      </KeyboardAvoidingView>
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
    height: 336,
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    lineHeight: 22,
    color: Colors.primaryFont,
    textAlignVertical: 'top',
  },
})
