import { Pressable, StyleSheet, View } from 'react-native'
import { TextTheme, ThemedText } from '../../shared/ThemedText'
import { QrStackScreenProps } from '../../types'
import ModalScreenContainer from '../../shared/ModalScreenContainer'
import en from '../../en'
import AppButton, { ButtonTheme } from '../../shared/AppButton'
import StyleVariables from '../../constants/StyleVariables'
import Colors from '../../constants/Colors'
import { useState } from 'react'

enum Tokens {
  TKN1 = 'TKN1',
  TKN2 = 'TKN2',
}

type TokenProps = {
  token: Tokens | undefined
}

export default function ConfirmSendModal({
  navigation,
}: QrStackScreenProps<'ConfirmSend'>) {
  const [selectedToken, setSelectedToken] = useState<Tokens | undefined>(
    undefined
  )
  const [amount, setAmount] = useState<string>('1,000 STX')

  function Token(props: TokenProps) {
    function handleSelectToken() {
      if (props.token && props.token !== selectedToken) {
        setSelectedToken(Tokens[props.token])
        setAmount(`30 ${props.token}`)
      } else {
        setSelectedToken(undefined)
        setAmount('1,000 STX')
      }
    }

    return (
      <Pressable
        style={[
          styles.tokenContainer,
          {
            backgroundColor:
              props.token === selectedToken
                ? Colors.primaryAppColorDarker
                : Colors.primaryBackgroundLighter,
          },
        ]}
        onPress={handleSelectToken}
      >
        <View style={styles.tokenImgPlaceholder}></View>
        <View>
          <ThemedText theme={TextTheme.LabelText}>Token Name</ThemedText>
          <View style={styles.tokenAmountContainer}>
            <ThemedText theme={TextTheme.InputText}>
              30&nbsp;{props.token}
            </ThemedText>
          </View>
        </View>
      </Pressable>
    )
  }

  return (
    <ModalScreenContainer title={en.Qr_flow_modal_title}>
      <ThemedText
        theme={TextTheme.LabelText}
        styleOverwrite={{ marginTop: 31, marginBottom: 4, textAlign: 'center' }}
      >
        {en.Common_send}
      </ThemedText>
      <ThemedText
        theme={TextTheme.Headline1Text}
        styleOverwrite={{ marginBottom: 4 }}
      >
        1,000 STX
      </ThemedText>
      <ThemedText
        theme={TextTheme.LabelText}
        styleOverwrite={{
          marginBottom: 20,
          color: Colors.primaryAppColorLighter,
          textAlign: 'center',
        }}
      >
        ~$31.5
      </ThemedText>
      <ThemedText
        theme={TextTheme.LabelText}
        styleOverwrite={{
          marginBottom: 12,
          alignSelf: 'flex-start',
        }}
      >
        {en.Qr_flow_swapping_assets_label}
      </ThemedText>
      <Token token={Tokens.TKN1} />
      <Token token={Tokens.TKN2} />
      <AppButton
        text={en.Common_send + ' ' + amount}
        theme={ButtonTheme.Primary}
        onPress={() => navigation.navigate('TransactionSuccess')}
        fullWidth
        style={{ marginTop: 'auto' }}
        marginBottom={80}
      />
    </ModalScreenContainer>
  )
}

const styles = StyleSheet.create({
  tokenContainer: {
    borderRadius: StyleVariables.borderRadius,
    height: 79,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tokenImgPlaceholder: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
  },
  tokenAmountContainer: {
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.disabled,
    marginTop: 4,
  },
})
