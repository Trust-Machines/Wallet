import AppButton, { ButtonTheme } from '../../shared/AppButton'
import { ScreenContainer } from '../../shared/ScreenContainer'
import { TextTheme, ThemedText } from '../../shared/ThemedText'
import en from '../../en'
import { RootStackScreenProps } from '../../types'
import AppSwitch from '../../shared/AppSwitch'
import { useState } from 'react'
import { Image, View } from 'react-native'
import Layout from '../../constants/Layout'

export default function BiometricsScreen({
  navigation,
}: RootStackScreenProps<'Biometrics'>) {
  const [isBiometricsEnabled, setIsBiometricsEnabed] = useState(false)

  function onToggleSwitch(value: boolean) {
    setIsBiometricsEnabed(value)
  }

  return (
    <ScreenContainer
      showStars
      styles={{
        justifyContent: 'space-between',
        paddingBottom: Layout.isSmallDevice ? 0 : '15%',
      }}
    >
      <View>
        <Image
          style={{
            marginTop: Layout.isSmallDevice ? 0 : '10%',
            alignSelf: 'center',
          }}
          source={require('../../assets/images/biometrics-screen-graphics.png')}
        />
        <ThemedText theme={TextTheme.Headline2Text}>
          {en.Biometrics_screen_title}
        </ThemedText>
        <ThemedText
          theme={TextTheme.BodyText}
          styleOverwrite={{ marginBottom: Layout.isSmallDevice ? '5%' : '20%' }}
        >
          {en.Biometrics_screen_subtitle}
        </ThemedText>
        <AppSwitch
          onToggle={(value: boolean) => onToggleSwitch(value)}
          value={isBiometricsEnabled}
          firstLineText={en.Biometrics_switch_text_first_line}
          secondLineText={en.Biometrics_switch_text_second_line}
        />
      </View>
      <AppButton
        onPress={() => navigation.navigate('SaveRecoveryPhrase')}
        text={en.Common_next}
        theme={isBiometricsEnabled ? ButtonTheme.Primary : ButtonTheme.Disabled}
        fullWidth
      />
    </ScreenContainer>
  )
}
