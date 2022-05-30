import { View, StyleSheet } from 'react-native'
import AppButton, { ButtonTheme } from '../../shared/AppButton'
import { ScreenContainer } from '../../shared/ScreenContainer'
import { TextTheme, ThemedText } from '../../shared/ThemedText'
import Colors from '../../constants/Colors'
import en from '../../en'
import { RootStackScreenProps } from '../../types'
import { SvgIcons } from '../../assets/images'
import { HDSegwitP2SHWallet } from '../../utils/wallets/hd-segwit-p2sh-wallet'
import { useEffect, useState } from 'react'
import { save } from './walletSlice'
import { useAppDispatch } from '../../redux/hooks'
import { saveSecurely, SecureKeys } from '../../utils/secureStore'

// const phraseWords = [
//   'glom',
//   'police',
//   'month',
//   'stamp',
//   'viable',
//   'claim',
//   'hospital',
//   'heart',
//   'alcohol',
//   'off',
//   'ocean',
//   'ghost',
// ]

type WordTagProps = {
  i: number
  word: string
}

export default function SaveRecoveryPhraseScreen({
  navigation,
}: RootStackScreenProps<'SaveRecoveryPhrase'>) {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [seedPhrase, setSeedPhrase] = useState<string[] | undefined>(undefined)

  useEffect(() => {
    createWallet()
  }, [])

  function WordTag({ i, word }: WordTagProps) {
    return (
      <View style={{ padding: 8 }}>
        <View style={styles.tag}>
          <ThemedText
            theme={TextTheme.InputText}
            styleOverwrite={{ marginRight: 14 }}
          >
            {i + 1}
          </ThemedText>
          <ThemedText theme={TextTheme.InputText}>{word}</ThemedText>
        </View>
      </View>
    )
  }

  const createWallet = async () => {
    if (!seedPhrase) {
      setLoading(true)
      try {
        const wallet = new HDSegwitP2SHWallet()
        await wallet.generate()

        console.log('wallet', wallet)
        console.log('wallet secret', wallet.secret)
        setSeedPhrase(wallet.secret.split(' '))
        const dispatch = useAppDispatch()
        dispatch(save(wallet))
        await saveSecurely(SecureKeys.SeedPhrase, wallet.secret)
        setLoading(false)
      } catch (e) {
        setLoading(false)
        setError(true)
        console.log('generate wallet error', e)
      }
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
        styleOverwrite={{ marginBottom: 27 }}
      >
        {en.Save_recovery_phrase_screen_subtitle}
      </ThemedText>
      <View>
        {loading ? (
          <ThemedText theme={TextTheme.NavigationText}>Loading...</ThemedText>
        ) : error ? (
          <ThemedText theme={TextTheme.NavigationText}>
            Something went wrong
          </ThemedText>
        ) : (
          <View style={styles.tagContainer}>
            {seedPhrase?.map((word, i) => (
              <WordTag word={word} i={i} key={word} />
            ))}
          </View>
        )}
      </View>
      <AppButton
        onPress={() => console.log('copied')}
        text={en.Copy_to_clipboard}
        theme={ButtonTheme.NoBorder}
        fullWidth={true}
        style={{ marginTop: 8 }}
        icon={<SvgIcons.General.CopyToClipboard />}
      />
      <AppButton
        onPress={() => navigation.navigate('CreateWalletSuccess')}
        text={en.Save_recovery_phrase_button_text}
        theme={ButtonTheme.Primary}
        fullWidth={true}
        marginBottom={70}
        style={{ marginTop: 'auto' }}
      />
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    borderRadius: 48,
    padding: 9,
    paddingLeft: 23,
    backgroundColor: Colors.primaryBackgroundDarker,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.disabled,
    minWidth: 140,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
})
