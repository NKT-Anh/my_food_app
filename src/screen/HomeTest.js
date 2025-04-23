import React, { useState } from 'react';
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
import style from '../globals/style';
import globalStyles from '../globals/globalStyles';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const categories = [
  { id: 1, name: 'Tất cả', icon: 'food-croissant', tag: 'Tất cả' },
  { id: 2, name: 'Đồ chay', icon: 'hamburger', tag: 'Đồ chay' },
  { id: 3, name: 'Rau củ', icon: 'pizza', tag: 'Rau củ' },
  { id: 4, name: 'Đồ hộp', icon: 'coffee', tag: 'Đồ hộp' },
  { id: 5, name: 'Đồ uống', icon: 'cup-water', tag: 'Đồ uống' },
  { id: 6, name: 'Gia vị', icon: 'noodles', tag: 'Gia vị' },
  { id: 7, name: 'Đồ tráng miệng', icon: 'ice-cream', tag: 'Đồ tráng miệng' },
  { id: 8, name: 'Fast food', icon: 'food-drumstick', tag: 'Fast food' },
  { id: 9, name: 'Đồ ăn', icon: 'food-croissant', tag: 'Đồ ăn' },
];

const featuredFoods = [
  {
    id: 1,
    name: 'Cam',
    image: require('../../assets/images/logoC.png'),
    price: '120.000đ',
    tags: ['Đồ ăn', 'Đồ uống'],
  },
  {
    id: 2,
    name: 'Cheeseburger',
    image: require('../../assets/images/logoC.png'),
    price: '90.000đ',
    tags: ['Fast food'],
  },
];

const HomeScreen = () => {
  const [selectedTag, setSelectedTag] = useState('Tất cả');
  const [likedFoods, setLikedFoods] = useState([]);

  const handleTag = (tag) => {
    setSelectedTag(tag === selectedTag ? 'Tất cả' : tag);
  };

  const toggleLike = (id) => {
    setLikedFoods((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFoods =
    selectedTag === 'Tất cả'
      ? featuredFoods
      : featuredFoods.filter((food) => food.tags?.includes(selectedTag));

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Danh mục yêu thích</Text>

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
          contentContainerStyle={{ paddingLeft: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => handleTag(item.tag)}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={40}
                color={item.tag === selectedTag ? '#ff5a00' : '#333'}
              />
              <Text
                style={[
                  styles.categoryText,
                  item.tag === selectedTag && { color: '#ff5a00', fontWeight: 'bold' },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Food List */}
        <Text style={styles.sectionTitle}>Món ăn yêu thích</Text>
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <View key={food.id} style={styles.foodCard}>
              <Image source={food.image} style={styles.foodImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodPrice}>{food.price}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleLike(food.id)}>
                <MaterialCommunityIcons
                  name={likedFoods.includes(food.id) ? 'heart-outline' : 'heart'}
                  size={24}
                  color={likedFoods.includes(food.id) ? 'gray' : 'red'}
                />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ color: 'gray', textAlign: 'center', marginTop: 20 }}>
            Không có món nào phù hợp.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: style.colors.backgroundColor,
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
