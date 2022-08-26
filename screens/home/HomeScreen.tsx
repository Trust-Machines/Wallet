import { useCallback } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { HomeHeader } from './components/HomeHeader';
import { ScreenContainer } from '@shared/ScreenContainer';
import { RootTabScreenProps } from '../../nav-types';
import { HomeBalance } from './components/HomeBalance';
import { TransactionItem } from './components/TransactionItem';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import {
  getAddress,
  getBalance,
  getTransactions,
  selectCurrentWalletData,
} from '@redux/walletSlice';

export function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const dispatch = useAppDispatch();
  const { currentWalletObject, currentWalletID } = useAppSelector(state => state.wallet);
  const currentWalletData = useSelector(selectCurrentWalletData);
  const { transactionsLoading, transactionsError } = useAppSelector(state => state.wallet);

  useFocusEffect(
    useCallback(() => {
      getHomeData();
    }, [currentWalletID])
  );

  const getHomeData = () => {
    dispatch(getAddress(currentWalletObject));
    dispatch(getBalance(currentWalletObject));
    dispatch(getTransactions(currentWalletObject));
  };

  const renderItem = ({ item }: any) => {
    if (currentWalletData?.transactions.length) {
      return <TransactionItem transaction={item} />;
    } else {
      return <View></View>;
    }
  };

  return (
    <ScreenContainer withTab>
      <HomeHeader />
      <View style={{ paddingBottom: 30, marginTop: 11 }}>
        {!transactionsError && (
          <FlatList
            nestedScrollEnabled
            data={currentWalletData?.transactions}
            renderItem={(item: any) => renderItem(item)}
            keyExtractor={(item: any) => item.hash}
            ListHeaderComponent={<HomeBalance />}
            refreshControl={
              <RefreshControl
                enabled={true}
                refreshing={transactionsLoading}
                onRefresh={getHomeData}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
