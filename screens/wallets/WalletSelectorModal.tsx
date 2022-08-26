import { ScrollView, View } from 'react-native';
import { WalletsStackScreenProps } from '../../navigation/nav-types';
import { ModalScreenContainer } from '@shared/ModalScreenContainer';
import { en } from '../../en';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { layout } from '@constants/Layout';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { Wallet } from './components/Wallet';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { setCurrentWalletID, WalletData } from '@redux/walletSlice';

export function WalletSelectorModal({}: //navigation,
WalletsStackScreenProps<'WalletSelector'>) {
  const [selectedWallet, setSelectedWallet] = useState<WalletData>();
  const [selectedWalletID, setSelectedWalletID] = useState<string | undefined>(undefined);

  const { wallets } = useAppSelector(state => state.wallet);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const switchWallet = () => {
    if (selectedWallet && selectedWalletID) {
      navigation.navigate('WalletsStack', {
        screen: 'UnlockWallet',
        params: {
          encryptedSeedPhrase: selectedWallet.encryptedSeed,
          onValidationFinished: async (success: boolean) => {
            if (success) {
              dispatch(setCurrentWalletID(selectedWalletID));

              navigation.navigate('Root', { screen: 'Home' });
            } else {
              console.log('error');
            }
          },
        },
      });
    }
  };

  const handleSelectWallet = (wallet: any, walletID: string) => {
    setSelectedWallet(wallet);
    setSelectedWalletID(walletID);
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
        <ScrollView>
          {wallets.map(wallet => {
            return (
              <Wallet
                wallet={wallet}
                walletID={wallet.id}
                selectWallet={() => handleSelectWallet(wallet, wallet.id)}
                selected={wallet.id === selectedWalletID}
              />
            );
          })}
        </ScrollView>
        <View style={{ flexDirection: 'row' }}>
          <AppButton
            text={en.Wallet_selector_add_new_button_text}
            theme={ButtonTheme.Primary}
            onPress={() => navigation.navigate('NewWalletStack', { screen: 'AddNewWallet' })}
            fullWidth
            style={{ flex: 1, marginRight: 10 }}
          />
          <AppButton
            text={en.Wallet_selector_use_selected_button_text}
            theme={!!selectedWalletID ? ButtonTheme.Primary : ButtonTheme.Disabled}
            onPress={() => switchWallet()}
            fullWidth
            style={{ flex: 1, marginLeft: 10 }}
          />
        </View>
      </View>
    </ModalScreenContainer>
  );
}
