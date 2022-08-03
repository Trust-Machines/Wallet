import { Pressable, StyleSheet, View } from 'react-native';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { colors } from '@constants/Colors';
import { SvgIcons } from '@assets/images';
import { styleVariables } from '@constants/StyleVariables';
import { formatAddress } from '@utils/helpers';
import { useNavigation } from '@react-navigation/native';

export type ContactProps = {
  name: string;
  address: string;
  selected: boolean;
  index: number;
  setSelectedContactIndex(index: number | undefined): void;
};

export function Contact(props: ContactProps) {
  const navigation = useNavigation();

  function handleContactPress(): void {
    props.setSelectedContactIndex(props.selected ? undefined : props.index);
  }

  return (
    <Pressable
      onPress={handleContactPress}
      style={[
        styles.contactContainer,
        {
          backgroundColor: props.selected
            ? colors.primaryAppColorDarker
            : colors.primaryBackgroundLighter,
        },
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <SvgIcons.Assets.Btc /*placeholder*/ />
        <View style={{ marginLeft: 16 }}>
          <ThemedText theme={TextTheme.LabelText}>{props.name}</ThemedText>
          <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{ color: colors.secondaryFont }}
          >
            {formatAddress(props.address)}
          </ThemedText>
        </View>
      </View>
      <Pressable
        style={styles.edit}
        onPress={() =>
          navigation.navigate('TransactionStack', {
            screen: 'EditContact',
            params: { name: props.name, address: props.address, index: props.index },
          })
        }
      >
        <ThemedText theme={TextTheme.CaptionText}>Edit</ThemedText>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contactContainer: {
    height: 64,
    paddingHorizontal: 16,
    borderRadius: styleVariables.borderRadius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  edit: {
    width: 60,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
