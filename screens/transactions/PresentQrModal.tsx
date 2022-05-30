import { StyleSheet, View } from 'react-native'
import { TextTheme, ThemedText } from '../../shared/ThemedText'
import { QrStackScreenProps } from '../../types'
import ModalScreenContainer from '../../shared/ModalScreenContainer'
import en from '../../en'
import QrCode from '../../assets/images/qr-placeholder.svg'
import AppButton, { ButtonTheme } from '../../shared/AppButton'
import StyleVariables from '../../constants/StyleVariables'
import Layout from '../../constants/Layout'

export default function PresentQrModal({
  navigation,
}: QrStackScreenProps<'PresentQr'>) {
  return (
    <ModalScreenContainer title={en.Qr_flow_modal_title}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          marginBottom: Layout.isSmallDevice ? 0 : '10%',
        }}
      >
        <View>
          <ThemedText
            theme={TextTheme.NavigationText}
            styleOverwrite={{
              marginTop: Layout.isSmallDevice ? 0 : 20,
              marginBottom: Layout.isSmallDevice ? 15 : 35,
            }}
          >
            {en.Qr_flow_present_qr_title}
          </ThemedText>
          <View style={styles.qrContainer}>
            <QrCode />
          </View>
        </View>
        <AppButton
          text={en.Qr_flow_present_qr_button_text}
          theme={ButtonTheme.Primary}
          onPress={() => navigation.navigate('ScanQr')}
          fullWidth
          style={{ marginTop: 'auto' }}
          marginBottom={80}
        />
      </View>
    </ModalScreenContainer>
  )
}

const styles = StyleSheet.create({
  qrContainer: {
    backgroundColor: '#FFF',
    borderRadius: StyleVariables.borderRadius,
    alignItems: 'center',
  },
})
