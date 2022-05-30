import { StyleSheet, View } from 'react-native'
import { QrStackScreenProps } from '../../types'
import ModalScreenContainer from '../../shared/ModalScreenContainer'
import en from '../../en'
import QrScanner from '../../assets/images/qr-scanner-placeholder.svg'
import AppButton, { ButtonTheme } from '../../shared/AppButton'
import Layout from '../../constants/Layout'

export default function ScanQrModal({
  navigation,
}: QrStackScreenProps<'ScanQr'>) {
  return (
    <ModalScreenContainer title={en.Qr_flow_modal_title}>
      <View style={styles.qrContainer}>
        <QrScanner />
        <AppButton
          text={en.Common_next}
          theme={ButtonTheme.Primary}
          onPress={() => navigation.navigate('ConfirmSend')}
          fullWidth
          style={{ marginTop: 'auto' }}
        />
      </View>
    </ModalScreenContainer>
  )
}

const styles = StyleSheet.create({
  qrContainer: {
    flex: 1,
    backgroundColor: '#000000',
    width: Layout.window.width,
    position: 'absolute',
    bottom: 0,
    top: 0,
    paddingTop: Layout.isSmallDevice ? '5%' : '10%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '10%',
  },
})
