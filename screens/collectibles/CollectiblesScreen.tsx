import {
  Image,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Pressable,
  ImageSourcePropType,
} from 'react-native'
import { ScreenContainer } from '../../shared/ScreenContainer'
import { RootTabScreenProps } from '../../types'
import { TextTheme, ThemedText } from '../../shared/ThemedText'
import Colors from '../../constants/Colors'
import StyleVariables from '../../constants/StyleVariables'

export default function CollectiblesScreen({
  navigation,
}: RootTabScreenProps<'Collectibles'>) {
  type ItemProps = {
    image: ImageSourcePropType
    title: string
    artist: string
  }

  const arts = [
    {
      image: require('../../assets/images/art1.png'),
      title: 'Melek Arican',
      artist: 'Ayse Lutfiye Atli',
      id: 1,
    },
    {
      image: require('../../assets/images/art2.png'),
      title: 'Melek Arican',
      artist: 'Ayse Lutfiye Atli',
      id: 2,
    },
    {
      image: require('../../assets/images/art3.png'),
      title: 'Melek Arican',
      artist: 'Ayse Lutfiye Atli',
      id: 3,
    },
    {
      image: require('../../assets/images/art4.png'),
      title: 'Melek Arican',
      artist: 'Ayse Lutfiye Atli',
      id: 4,
    },
    {
      image: require('../../assets/images/art5.png'),
      title: 'Melek Arican',
      artist: 'Ayse Lutfiye Atli',
      id: 5,
    },
    {
      image: require('../../assets/images/art6.png'),
      title: 'Melek Arican',
      artist: 'Ayse Lutfiye Atli',
      id: 6,
    },
    {
      image: require('../../assets/images/art5.png'),
      title: 'Melek Arican',
      artist: 'Ayse Lutfiye Atli',
      id: 7,
    },
    {
      image: require('../../assets/images/art6.png'),
      title: 'Melek Arican',
      artist: 'Ayse Lutfiye Atli',
      id: 8,
    },
    {
      image: require('../../assets/images/art5.png'),
      title: 'Melek Arican',
      artist: 'Ayse Lutfiye Atli',
      id: 9,
    },
    {
      image: require('../../assets/images/art6.png'),
      title: 'Melek Arican',
      artist: 'Ayse Lutfiye Atli',
      id: 10,
    },
  ]

  const renderItem = ({ item }: { item: ItemProps }) => (
    <Pressable style={styles.artContainer}>
      <Image
        source={item.image}
        style={{
          marginBottom: 6,
          width: '100%',
          borderRadius: StyleVariables.borderRadius,
        }}
      />
      <ThemedText theme={TextTheme.CaptionText}>{item.title}</ThemedText>
      <Text
        style={{
          fontFamily: 'Inter_600SemiBold',
          fontSize: 12,
          lineHeight: 15,
          color: Colors.primaryAppColorDarker,
        }}
      >
        {item.artist}
      </Text>
    </Pressable>
  )

  return (
    <ScreenContainer paddingTop={8} paddingHorizontal={8}>
      <SafeAreaView>
        <FlatList
          data={arts}
          renderItem={renderItem}
          contentContainerStyle={{
            justifyContent: 'center',
            paddingBottom:
              StyleVariables.bottomTabHeight +
              StyleVariables.bottomTabBottomOffset,
          }}
          columnWrapperStyle={{
            justifyContent: 'center',
          }}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  artContainer: {
    width: '50%',
    padding: 8,
  },
})
