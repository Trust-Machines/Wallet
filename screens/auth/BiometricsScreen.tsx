import AppButton, { ButtonTheme } from '../../shared/AppButton'
import { ScreenContainer } from '../../shared/ScreenContainer'
import { TextTheme, ThemedText } from '../../shared/ThemedText'
import en from '../../en'
import { RootStackScreenProps } from '../../types'
import AppSwitch from '../../shared/AppSwitch'
import { useState } from 'react'
import { Image } from 'react-native'

export default function BiometricsScreen({
  navigation,
}: RootStackScreenProps<'Biometrics'>) {
  const [isBiometricsEnabled, setIsBiometricsEnabed] = useState(false)

  function onToggleSwitch(value: boolean) {
    setIsBiometricsEnabed(value)
  }

  return (
    <ScreenContainer showStars>
      <Image
        style={{ marginTop: '25%', alignSelf: 'center' }}
        source={require('../../assets/images/biometrics-screen-graphics.png')}
      />
      <ThemedText theme={TextTheme.Headline2Text}>
        {en.Biometrics_screen_title}
      </ThemedText>
      <ThemedText
        theme={TextTheme.BodyText}
        styleOverwrite={{ marginBottom: '20%' }}
      >
        {en.Biometrics_screen_subtitle}
      </ThemedText>
      <AppSwitch
        onToggle={(value: boolean) => onToggleSwitch(value)}
        value={isBiometricsEnabled}
        firstLineText={en.Biometrics_switch_text_first_line}
        secondLineText={en.Biometrics_switch_text_second_line}
      />
      <AppButton
        onPress={() => navigation.navigate('SaveRecoveryPhrase')}
        text={en.Common_next}
        theme={isBiometricsEnabled ? ButtonTheme.Primary : ButtonTheme.Disabled}
        fullWidth={true}
        marginBottom={70}
        style={{ marginTop: 'auto' }}
      />
    </ScreenContainer>
  )
}
