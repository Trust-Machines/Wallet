import { useCallback } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { HomeHeader } from "./components/HomeHeader";
import { ScreenContainer } from "@shared/ScreenContainer";
import { RootTabScreenProps } from "../../types";
import { HomeBalance } from "./components/HomeBalance";
import { AppButton, ButtonTheme } from "@shared/AppButton";
import { en } from "../../en";
import { TextTheme, ThemedText } from "@shared/ThemedText";
import { colors } from "@constants/Colors";
import { TransactionItem } from "./components/TransactionItem";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { layout } from "@constants/Layout";
import { getBalance } from "@redux/balanceSlice";
import { getTransactions } from "@redux/transactionsSlice";
import { getAddress } from "@redux/addressSlice";
import { useFocusEffect } from "@react-navigation/native";

export function HomeScreen({ navigation }: RootTabScreenProps<"Home">) {
  const dispatch = useAppDispatch();
  const { walletObject, currentWalletID } = useAppSelector(
    (state) => state.wallet
  );
  const { transactions, transactionsLoading, transactionsError } =
    useAppSelector((state) => state.transactions);

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
          width: layout.window.width,
          marginLeft: -20,
        }}
        contentContainerStyle={{ paddingHorizontal: 20, position: "relative" }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            enabled={true}
            refreshing={transactionsLoading}
            onRefresh={getHomeData}
          />
        }
      >
        <Image
          source={require("@assets/images/home-chart.png")}
          style={{ position: "absolute", right: -20 }}
        />
        <HomeBalance />
        <View style={{ flexDirection: "row", marginTop: 18, marginBottom: 21 }}>
          <AppButton
            theme={ButtonTheme.Primary}
            text={en.Common_receive}
            style={{ flex: 1 }}
            paddingHorizontal={0}
            onPress={() =>
              navigation.navigate("ReceiveStack", {
                screen: "ReceivePresentQr",
              })
            }
            fullWidth
          />
          <AppButton
            theme={ButtonTheme.Primary}
            text={en.Common_send}
            style={{ flex: 1, marginHorizontal: 16 }}
            onPress={() =>
              navigation.navigate("SendStack", {
                screen: "Send",
              })
            }
            fullWidth
          />
          <AppButton
            theme={ButtonTheme.Primary}
            text={en.Common_buy}
            style={{ flex: 1 }}
            onPress={() =>
              navigation.navigate("BuyCryptoStack", {
                screen: "BuyCrypto",
              })
            }
            fullWidth
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 16,
          }}
        >
          <ThemedText theme={TextTheme.LabelText}>
            {en.Home_your_transactions}
          </ThemedText>
          {/* <ThemedText
            theme={TextTheme.CaptionText}
            styleOverwrite={{ color: colors.primaryAppColorDarker }}
          >
            {en.Home_view_all}
          </ThemedText> */}
        </View>
        {/* <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 12,
            lineHeight: 15,
            color: colors.disabled,
            marginBottom: 8,
          }}
        >
          29 April 2022
        </Text> */}
        <View style={{ paddingBottom: 30 }}>
          {!transactionsError && (
            <FlatList
              nestedScrollEnabled
              data={transactions}
              renderItem={(item: any) => renderItem(item)}
              keyExtractor={(item) => item.hash}
            />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
