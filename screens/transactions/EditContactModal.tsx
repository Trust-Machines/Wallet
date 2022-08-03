import { Alert, View } from 'react-native';
import { TransactionStackScreenProps } from '../../navigation/nav-types';
import { ModalScreenContainer } from '@shared/ModalScreenContainer';
import { en } from '../../en';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { layout } from '@constants/Layout';
import { useAppDispatch } from '@redux/hooks';
import { useState } from 'react';
import { addNewContact, deleteContactByIndex, editContact } from '@redux/contactsSlice';
import { AppTextInput } from '@shared/AppTextInput';

export function EditContactModal({
  route,
  navigation,
}: TransactionStackScreenProps<'EditContact'>) {
  const { name, address, index } = route.params;
  const [contactName, setContactName] = useState<string>(name ?? '');
  const [contactAddress, setContactAddress] = useState<string>(address ?? '');
  const dispatch = useAppDispatch();

  const saveContact = () => {
    if (index !== undefined) {
      dispatch(editContact({ contact: { name: contactName, address: contactAddress }, index }));
    } else {
      dispatch(addNewContact({ name: contactName, address: contactAddress }));
    }
    navigation.goBack();
  };

  const deleteContact = () => {
    if (!!index) {
      dispatch(deleteContactByIndex(index));
      navigation.goBack();
    }
  };

  const handleDeletePress = async () => {
    Alert.alert('', `Are you sure you want to delete this contact?`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes, Delete',
        onPress: deleteContact,
      },
    ]);
  };

  return (
    <ModalScreenContainer title={index ? 'Edit contact' : 'Add new contact'}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          marginBottom: layout.isSmallDevice ? 0 : '10%',
        }}
      >
        <View>
          <AppTextInput
            value={contactName}
            setValue={setContactName}
            labelText={'Contact name'}
            style={{ marginTop: 40 }}
          />
          <AppTextInput
            value={contactAddress}
            setValue={setContactAddress}
            labelText={'Contact address'}
            style={{ marginTop: 20 }}
          />
        </View>

        <View style={{ flexDirection: 'row' }}>
          <AppButton
            text={'Delete'}
            theme={ButtonTheme.NoBorder}
            onPress={handleDeletePress}
            fullWidth={false}
          />
          <AppButton
            text={en.Common_save}
            theme={
              contactName.length && contactAddress.length
                ? ButtonTheme.Primary
                : ButtonTheme.Disabled
            }
            onPress={saveContact}
            fullWidth
            style={{ flex: 1, marginLeft: 10 }}
          />
        </View>
      </View>
    </ModalScreenContainer>
  );
}
