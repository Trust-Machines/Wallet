import { StyleSheet, TextInput, View } from 'react-native';
import { ScreenContainer } from '@shared/ScreenContainer';
import { RootTabScreenProps } from '../../navigation/nav-types';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { colors } from '@constants/Colors';
import { styleVariables } from '@constants/StyleVariables';
import { SvgIcons } from '@assets/images';
import { en } from '../../en';

export function DefiBrowserScreen({ navigation }: RootTabScreenProps<'DefiBrowser'>) {
  return (
    <ScreenContainer paddingTop={55} withTab>
      <View style={{ position: 'relative' }}>
        <TextInput
          style={[styles.inputContainer, styles.searchInput]}
          keyboardType="default"
          keyboardAppearance="dark"
          placeholder={en.Defi_browser_search_placeholder}
          placeholderTextColor={'rgba(248, 249, 250, 0.3)'}
        />
        <SvgIcons.General.Search style={{ position: 'absolute', right: 0 }} />
      </View>
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <SvgIcons.Defi.Globe60 style={{ marginBottom: 20 }} />
        <ThemedText theme={TextTheme.LabelText}>{en.Defi_browser_launch_label}</ThemedText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    lineHeight: 22,
    color: colors.primaryFont,
    height: 40,
    paddingRight: 40,
  },
  inputContainer: {
    backgroundColor: colors.inputBackground,
    borderRadius: styleVariables.borderRadius,
    borderWidth: 1,
    borderColor: colors.disabled,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
});
