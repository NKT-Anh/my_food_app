import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { searchFoods, addToCart } from '../Firebase/FirebaseAPI';
import { useNavigation, useRoute } from '@react-navigation/native';
import FoodItem from './FoodItem';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Style from '../globals/style';

const SearchScreen = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        navigation.navigate('LogIn');
      }
    });
    return () => unsubscribe();
  }, [navigation]);

  useEffect(() => {
    if (route.params?.searchText) {
      setSearchText(route.params.searchText);
      handleSearch(route.params.searchText);
    }
  }, [route.params]);

  const handleSearch = async (text) => {
    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    const result = await searchFoods(text);
    if (result.success) {
      setSearchResults(result.data);
    }
    setIsLoading(false);
  };

  const openModal = (foodItem) => {
    if (foodItem !== selectedFood) {
      setSelectedFood(foodItem);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setSelectedFood(null);
    setModalVisible(false);
  };

  const handleAddToCart = async (userId, foodItem, soLuong, tongGia) => {
    const result = await addToCart(userId, foodItem, soLuong, tongGia);
    if (result.success) {
      Alert.alert("Đã thêm món ăn vào giỏ hàng", result.message);
      closeModal();
    } else {
      Alert.alert("Lỗi", result.message);
    }
  };

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity
      style={styles.foodCard}
      onPress={() => openModal(item)}
    >
      <Image source={{ uri: item.foodImage }} style={styles.foodImage} />
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.foodName}</Text>
        <Text style={styles.foodPrice}>{Number(item.foodPrice).toLocaleString('vi-VN')} đ</Text>
        <View style={styles.tagContainer}>
          {Array.isArray(item.tag) && item.tag.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Style.colors.cam} />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm món ăn..."
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                handleSearch(text);
              }}
              autoFocus
            />
            {searchText !== '' && (
              <TouchableOpacity
                onPress={() => {
                  setSearchText('');
                  setSearchResults([]);
                }}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Style.colors.cam} />
          </View>
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderFoodItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.foodList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchText ? 'Không tìm thấy món ăn phù hợp' : 'Nhập từ khóa để tìm kiếm'}
                </Text>
              </View>
            }
          />
        )}

        {selectedFood && (
          <FoodItem
            visible={modalVisible}
            foodItem={selectedFood}
            userId={userId}
            onClose={closeModal}
            onAddToCart={handleAddToCart}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    elevation: 2,
  },
  backButton: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  foodList: {
    padding: 10,
    paddingBottom: 100,
  },
  foodCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  foodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  foodPrice: {
    fontSize: 15,
    color: Style.colors.cam,
    fontWeight: '600',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#fff5eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Style.colors.cam,
  },
  tagText: {
    fontSize: 12,
    color: Style.colors.cam,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default SearchScreen;