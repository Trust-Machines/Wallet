import { useCallback } from 'react';
import { FlatList, RefreshControl, ScrollView, View } from 'react-native';
import { HomeHeader } from './components/HomeHeader';
import { ScreenContainer } from '@shared/ScreenContainer';
import { RootTabScreenProps } from '../../types';
import { HomeBalance } from './components/HomeBalance';
import { TransactionItem } from './components/TransactionItem';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { getBalance } from '@redux/balanceSlice';
import { getTransactions } from '@redux/transactionsSlice';
import { getAddress } from '@redux/addressSlice';
import { useFocusEffect } from '@react-navigation/native';

export function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const dispatch = useAppDispatch();
  const { walletObject, currentWalletID } = useAppSelector(state => state.wallet);
  const { transactions, transactionsLoading, transactionsError } = useAppSelector(
    state => state.transactions
  );

  useFocusEffect(
    useCallback(() => {
      getHomeData();
    }, [currentWalletID])
  );

  const getHomeData = () => {
    dispatch(getAddress(walletObject));
    dispatch(getBalance(walletObject));
    dispatch(getTransactions(walletObject));
  };

  const renderItem = ({ item }: any) => {
    if (transactions.length) {
      return <TransactionItem transaction={item} />;
    } else {
      return <View></View>;
    }
  };

  return (
    <ScreenContainer withTab>
      <HomeHeader />
      <ScrollView
        style={{
          marginTop: 11,
        }}
        contentContainerStyle={{ position: 'relative' }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl enabled={true} refreshing={transactionsLoading} onRefresh={getHomeData} />
        }
      >
        <HomeBalance />

        <View style={{ paddingBottom: 30 }}>
          {!transactionsError && (
            <FlatList
              nestedScrollEnabled
              data={transactions}
              renderItem={(item: any) => renderItem(item)}
              keyExtractor={item => item.hash}
            />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
