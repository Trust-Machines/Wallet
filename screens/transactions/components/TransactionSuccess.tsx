import { Image, StyleSheet, View } from 'react-native';
import { TextTheme, ThemedText } from '@shared/ThemedText';
import { ModalScreenContainer } from '@shared/ModalScreenContainer';
import { en } from '../../../en';
import { AppButton, ButtonTheme } from '@shared/AppButton';
import { styleVariables } from '@constants/StyleVariables';
import { colors } from '@constants/Colors';
import { satoshiToBitcoinString } from '@utils/helpers';
import { Assets } from '@constants/CommonEnums';
import { TransactionDetails } from '@hooks/useTransactionSending';
import { useNavigation } from '@react-navigation/native';

type TransactionSuccessProps = {
  transactionDetails: TransactionDetails;
  title: string;
};

export function TransactionSuccess(props: TransactionSuccessProps) {
  const { transactionId, fee } = props.transactionDetails;
  const navigation = useNavigation();

  return (
    <ModalScreenContainer title={'Transaction Sent'}>
      <ThemedText theme={TextTheme.Headline2Text} styleOverwrite={{ paddingHorizontal: 20 }}>
        {props.title}
      </ThemedText>
      <View style={{ flex: 1, marginBottom: '10%', justifyContent: 'space-between' }}>
        <Image
          source={require('@assets/images/success-graphics.png')}
          style={{ alignSelf: 'center' }}
        />

        <View>
          <View style={styles.technicalDetailsContainer}>
            <View style={styles.stretchContainer}>
              <ThemedText
                theme={TextTheme.DetailText}
                styleOverwrite={{ color: colors.secondaryFont }}
              >
                Fee
              </ThemedText>
              <ThemedText theme={TextTheme.LabelText}>
                {satoshiToBitcoinString(fee)} {Assets.BTC}
              </ThemedText>
            </View>

            <View style={styles.stretchContainer}>
              <ThemedText theme={TextTheme.DetailText} styleOverwrite={styles.labelText}>
                Transaction Hash
              </ThemedText>
              <ThemedText
                theme={TextTheme.LabelText}
                numberOfLines={1}
                styleOverwrite={{ flexShrink: 1 }}
              >
                {transactionId}
              </ThemedText>
            </View>

            <View style={styles.stretchContainer}>
              <ThemedText theme={TextTheme.DetailText} styleOverwrite={styles.labelText}>
                Block
              </ThemedText>
              <ThemedText theme={TextTheme.LabelText}>224884</ThemedText>
            </View>

            <View style={styles.stretchContainer}>
              <ThemedText theme={TextTheme.DetailText} styleOverwrite={styles.labelText}>
                Network
              </ThemedText>
              <ThemedText theme={TextTheme.LabelText}>Bitcoin Mainnet</ThemedText>
            </View>
          </View>
          <AppButton
            text={en.Common_done}
            theme={ButtonTheme.Primary}
            onPress={() => navigation.navigate('Root')}
            fullWidth
          />
        </View>
      </View>
    </ModalScreenContainer>
  );
}

const styles = StyleSheet.create({
  stretchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  technicalDetailsContainer: {
    backgroundColor: colors.inputBackground,
    borderRadius: styleVariables.borderRadius,
    borderWidth: 1,
    borderColor: colors.disabled,
    paddingTop: 20,
    paddingHorizontal: 14,
    marginBottom: 23,
    marginTop: 8,
  },
  labelText: {
    color: colors.secondaryFont,
    marginRight: 20,
  },
});
