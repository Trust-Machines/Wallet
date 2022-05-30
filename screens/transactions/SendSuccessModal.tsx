import { Image, StyleSheet, View } from 'react-native'
import { TextTheme, ThemedText } from '../../shared/ThemedText'
import { SendStackScreenProps } from '../../types'
import ModalScreenContainer from '../../shared/ModalScreenContainer'
import en from '../../en'
import AppButton, { ButtonTheme } from '../../shared/AppButton'
import StyleVariables from '../../constants/StyleVariables'
import Colors from '../../constants/Colors'

export default function SendSuccessModal({
  navigation,
}: SendStackScreenProps<'SendSuccess'>) {
  return (
    <ModalScreenContainer title={en.Qr_flow_modal_title}>
      <ThemedText
        theme={TextTheme.Headline2Text}
        styleOverwrite={{ paddingHorizontal: 20 }}
      >
        {en.Qr_flow_transaction_success_title}
      </ThemedText>
      <Image
        source={require('../../assets/images/success-graphics.png')}
        style={{ alignSelf: 'center' }}
      />

      <View style={styles.technicalDetailsContainer}>
        <View style={styles.stretchContainer}>
          <ThemedText
            theme={TextTheme.DetailText}
            styleOverwrite={{ color: Colors.secondaryFont }}
          >
            Fee
          </ThemedText>
          <ThemedText theme={TextTheme.LabelText}>2 STX</ThemedText>
        </View>

        <View style={styles.stretchContainer}>
          <ThemedText
            theme={TextTheme.DetailText}
            styleOverwrite={{ color: Colors.secondaryFont }}
          >
            Transaction Hash
          </ThemedText>
          <ThemedText theme={TextTheme.LabelText}>
            611ea15f45311bd...
          </ThemedText>
        </View>

        <View style={styles.stretchContainer}>
          <ThemedText
            theme={TextTheme.DetailText}
            styleOverwrite={{ color: Colors.secondaryFont }}
          >
            Block
          </ThemedText>
          <ThemedText theme={TextTheme.LabelText}>224884</ThemedText>
        </View>

        <View style={styles.stretchContainer}>
          <ThemedText
            theme={TextTheme.DetailText}
            styleOverwrite={{ color: Colors.secondaryFont }}
          >
            Network
          </ThemedText>
          <ThemedText theme={TextTheme.LabelText}>Bitcoin Mainnet</ThemedText>
        </View>
      </View>

      <AppButton
        text={en.Common_done}
        theme={ButtonTheme.Primary}
        onPress={() => navigation.getParent()?.goBack()}
        fullWidth
      />
    </ModalScreenContainer>
  )
}

const styles = StyleSheet.create({
  stretchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
