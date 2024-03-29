import { LinearGradient } from 'expo-linear-gradient';
import {
  StyleSheet,
  View,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ViewStyle,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { colors } from '@constants/Colors';
import { styleVariables } from '@constants/StyleVariables';
import { SvgIcons } from '@assets/images';

type ScreenContainerProps = {
  children: React.ReactNode;
  showStars?: boolean;
  paddingTop?: number;
  paddingHorizontal?: number;
  withTab?: boolean;
  styles?: ViewStyle;
  loading?: boolean;
  canGoBack?: boolean;
  onGoBack?(): void;
};

export function ScreenContainer(props: ScreenContainerProps) {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
      <View style={styles.container}>
        <StatusBar barStyle={'light-content'} translucent backgroundColor={'transparent'} />
        <LinearGradient
          colors={[colors.primaryBackgroundDarker, colors.primaryBackgroundLighter]}
          style={styles.container}
        >
          {props.showStars && (
            <Image
              style={styles.image}
              source={require('@assets/images/constellations-background.png')}
            />
          )}
          {props.canGoBack ? (
            <Pressable
              onPress={props.onGoBack}
              style={{ padding: 16, position: 'absolute', left: 0, top: 38 }}
            >
              <SvgIcons.General.ArrowLeft />
            </Pressable>
          ) : null}
          <View
            style={[
              styles.contentWrapper,
              {
                paddingTop: props.paddingTop ?? styleVariables.statusBarHeight,
                paddingHorizontal: props.paddingHorizontal ?? 20,
                paddingBottom: props.withTab
                  ? styleVariables.bottomTabHeight + styleVariables.bottomTabBottomOffset
                  : 0,
                ...props.styles,
              },
            ]}
          >
            {/*@ts-ignore*/}
            {props.children}
          </View>
        </LinearGradient>
        {props.loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={colors.white} />
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    padding: styleVariables.commonSpacing,
  },
  image: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  loadingContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    paddingTop: '45%',
  },
});
