import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { WalletsStackScreenProps } from '../../nav-types';
import { ModalScreenContainer } from '@shared/ModalScreenContainer';
import { en } from '../../en';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { styleVariables } from '@constants/StyleVariables';
import { layout } from '@constants/Layout';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { useState } from 'react';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { colors } from '@constants/Colors';
import { editWalletLabel, deleteWalletById } from '@redux/walletSlice';

export function EditWalletModal({ route, navigation }: WalletsStackScreenProps<'EditWallet'>) {
  const { wallet, id } = route.params;
  const [label, setLabel] = useState<string>(wallet.label);
  const { currentWalletID } = useAppSelector(state => state.wallet);
  const dispatch = useAppDispatch();

  const saveEditedWallet = async () => {
    dispatch(editWalletLabel(label));
    navigation.navigate('WalletSelector');
  };

  const deleteWallet = () => {
    console.log('DELETE');
    dispatch(deleteWalletById(id));
    navigation.navigate('WalletSelector');
  };

  const handleDeletePress = async () => {
    Alert.alert(
      '',
      `Are you sure you want to delete this wallet? This won't remove it from the Bitcoin network, only this app`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes, Delete',
          onPress: deleteWallet,
        },
      ]
    );
  };

  return (
    <ModalScreenContainer title={en.Wallet_selector_modal_title}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          marginBottom: layout.isSmallDevice ? 0 : '10%',
        }}
      >
        <View>
          <ThemedText
            theme={TextTheme.Headline2Text}
            styleOverwrite={{ marginTop: 20, marginBottom: 60 }}
          >
            Edit wallet
          </ThemedText>

          <View>
            <ThemedText theme={TextTheme.LabelText}>Wallet name</ThemedText>
            <TextInput
              value={label}
              onChangeText={(pw: string) => setLabel(pw)}
              style={styles.input}
              keyboardType="default"
              keyboardAppearance="dark"
              placeholderTextColor={'rgba(248, 249, 250, 0.3)'}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <AppButton
            text={'Delete'}
            theme={currentWalletID === id ? ButtonTheme.Disabled : ButtonTheme.NoBorder}
            onPress={handleDeletePress}
            fullWidth={false}
          />
          <AppButton
            text={en.Common_save}
            theme={label.length ? ButtonTheme.Primary : ButtonTheme.Disabled}
            onPress={saveEditedWallet}
            fullWidth
            style={{ flex: 1, marginLeft: 10 }}
          />
        </View>
      </View>
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  qrContainer: {
    backgroundColor: '#FFF',
    borderRadius: styleVariables.borderRadius,
    alignItems: 'center',
    padding: 40,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: styleVariables.borderRadius,
    borderWidth: 1,
    borderColor: colors.disabled,
    padding: 16,
    paddingTop: 16,
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    lineHeight: 22,
    color: colors.primaryFont,
    marginTop: 12,
  },
});
