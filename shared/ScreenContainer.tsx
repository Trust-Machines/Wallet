import { LinearGradient } from 'expo-linear-gradient'
import {
  StyleSheet,
  View,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ViewStyle,
} from 'react-native'
import Colors from '../constants/Colors'
import StyleVariables from '../constants/StyleVariables'

type ScreenContainerProps = {
  children: React.ReactNode
  showStars?: boolean
  paddingTop?: number
  paddingHorizontal?: number
  withTab?: boolean
  styles?: ViewStyle
}

export function ScreenContainer(props: ScreenContainerProps) {
  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}
    >
      <View style={styles.container}>
        <StatusBar
          barStyle={'light-content'}
          translucent
          backgroundColor={'transparent'}
        />
        <LinearGradient
          colors={[
            Colors.primaryBackgroundDarker,
            Colors.primaryBackgroundLighter,
          ]}
          style={styles.container}
        >
          {props.showStars && (
            <Image
              style={styles.image}
              source={require('../assets/images/constellations-background.png')}
            />
          )}
          <View
            style={[
              styles.contentWrapper,
              {
                paddingTop: props.paddingTop ?? StyleVariables.statusBarHeight,
                paddingHorizontal: props.paddingHorizontal ?? 20,
                paddingBottom: props.withTab
                  ? StyleVariables.bottomTabHeight +
                    StyleVariables.bottomTabBottomOffset
                  : 20,
                ...props.styles,
              },
            ]}
          >
            {props.children}
          </View>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
})
