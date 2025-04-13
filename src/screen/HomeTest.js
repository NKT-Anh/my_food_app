import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import style from '../globals/style';
import globalStyles from '../globals/globalStyles';

const categories = [
  { id: 1, name: 'Pizza', image: require('../../assets/images/logoC.png') },
  { id: 2, name: 'Burgers', image: require('../../assets/images/logoC.png') },
  { id: 3, name: 'Drinks', image: require('../../assets/images/logoC.png') },
  // Add more...
];

const featuredFoods = [
  {
    id: 1,
    name: 'Pizza Pepperoni',
    image: require('../../assets/images/logoC.png'),
    price: '120.000đ',
  },
  {
    id: 2,
    name: 'Cheeseburger',
    image: require('../../assets/images/logoC.png'),
    price: '90.000đ',
  },
];

const HomeScreen = () => {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.greetingText}>Xin chào 👋</Text>
        <Text style={styles.title}>Bạn muốn ăn gì hôm nay?</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="gray" />
          <TextInput
            placeholder="Tìm món ăn..."
            style={styles.searchInput}
            placeholderTextColor="gray"
          />
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Danh mục</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.categoryItem}>
              <Image source={item.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Featured */}
        <Text style={styles.sectionTitle}>Món nổi bật</Text>
        {featuredFoods.map((item) => (
          <View key={item.id} style={styles.foodCard}>
            <Image source={item.image} style={styles.foodImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodPrice}>{item.price}</Text>
            </View>
            <AntDesign name="hearto" size={20} color="red" />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: style.colors.backgroundColor,
  },
  greetingText: {
    fontSize: 18,
    color: style.colors.text1,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: style.colors.title,
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    height: 45,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: style.colors.title,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    color: style.colors.text3,
  },
  foodCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },
  foodImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: style.colors.text1,
  },
  foodPrice: {
    fontSize: 14,
    color: 'gray',
  },
});

export default HomeScreen;
