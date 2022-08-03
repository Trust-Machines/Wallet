import { Alert, View } from 'react-native';
import { WalletsStackScreenProps } from '../../nav-types';
import { ModalScreenContainer } from '@shared/ModalScreenContainer';
import { en } from '../../en';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { layout } from '@constants/Layout';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { useState } from 'react';
import { editWalletLabel, deleteWalletById } from '@redux/walletSlice';
import { AppTextInput } from '@shared/AppTextInput';

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
    <ModalScreenContainer title={'Edit wallet'}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          marginBottom: layout.isSmallDevice ? 0 : '10%',
        }}
      >
        <View style={{ marginTop: 40 }}>
          <AppTextInput value={label} setValue={setLabel} labelText={'Wallet name'} />
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
