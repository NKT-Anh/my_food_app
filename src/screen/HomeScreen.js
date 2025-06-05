import React, { useEffect, useState } from 'react'
import { 
  Text, 
  View, 
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import globalStyles from '../globals/globalStyles';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../navigator/BottomNavigation';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons, Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Style from '../globals/style';
import TagComponent from '../component/TagComponent';
import { addToCart, loadFoodHome, removeFavoritesFood, addFavoritesFood, loadFavoritesFood } from '../Firebase/FirebaseAPI';
import Loading from '../component/Loading';
import FoodItem from './FoodItem';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion, setDoc } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseConfig';
import { useFavorites } from '../Firebase/FavoritesContext';

const { width } = Dimensions.get('window');

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

const HomeScreen = () => {
    const navigation = useNavigation();
    const [menu,showMenu] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [foodData,setFoodData] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);
    const [filteredFood, setFilteredFood] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [user, setUser] = useState(null);
    const { favorites, updateFavorites } = useFavorites();

    const openModal = (foodItem) => {
      if (foodItem !== selectedFood){
         setSelectedFood(foodItem);
         setModalVisible(true);
      }
   };
    const closeModal = (foodItem) =>{
      setSelectedFood(null);
      setModalVisible(false)
    }

    const handleAddToFavorites = async (foodId) => {
      if (!user?.uid) {
        navigation.navigate('LogIn')
        return
      }

      try {
        const userRef = doc(db, 'User', user.uid)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
          const currentFavorites = userDoc.data().favorites || []
          const isFavorite = currentFavorites.includes(foodId)

          if (isFavorite) {
            await removeFavoritesFood(user.uid, foodId)
            const newFavorites = favoriteItems.filter(id => id !== foodId);
            setFavoriteItems(newFavorites);
            updateFavorites(newFavorites);
            console.log('Removed from favorites:', foodId);
            console.log('New favorites:', newFavorites);
          } else {
            await addFavoritesFood(user.uid, foodId)
            const newFavorites = [...favoriteItems, foodId];
            setFavoriteItems(newFavorites);
            updateFavorites(newFavorites);
            console.log('Added to favorites:', foodId);
            console.log('New favorites:', newFavorites);
          }
        } else {
          await addFavoritesFood(user.uid, foodId)
          const newFavorites = [foodId];
          setFavoriteItems(newFavorites);
          updateFavorites(newFavorites);
          console.log('Added to favorites (new user):', foodId);
          console.log('New favorites:', newFavorites);
        }
      } catch (error) {
        console.error("Error handling favorite:", error)
      }
    }


    const handleAddToCart = async (userId, foodItem,soLuong,tongGia) => {
      const result = await addToCart(userId, foodItem,soLuong,tongGia);
      if (result.success) {
        Alert.alert("Đã thêm món ăn vào giỏ hàng", result.message);
        closeModal();
      } else {
        Alert.alert("Lỗi", result.message);
      }
    };

    const handleLoadCart = async (userId) => {
      const result = await loadCart(userId, setCartItems); 
      if (result.success) {
        console.log("Giỏ hàng đã được tải thành công:", result.cart);
        navigation.navigate('CartScreen', { cartItems: result.cart });àng
      } else {
        console.log("Lỗi khi tải giỏ hàng:", result.message);
      }
    };

    useEffect(()=>{
      const stopLoadFood = loadFoodHome((data)=>{
        setFoodData(data)
        setFilteredFood(data)
        setLoading(false);
      });
      return () => stopLoadFood();
    }, []);

    useEffect(() => {
      if (selectedTag === 'Tất cả'){
        setFilteredFood(foodData);

      } else if(selectedTag !== null) {
        const filtered = foodData.filter(item => Array.isArray(item.tag) && item.tag.includes(selectedTag));
        setFilteredFood(filtered);
      } else {
        setFilteredFood(foodData);
      }
    }, [selectedTag, foodData]); 
    
    const handleTag = (tag) => {
      if (selectedTag === tag) {
        setSelectedTag(null);
      } else {
        setSelectedTag(tag);
      }
    };

    useEffect(() => {
      const auth = getAuth();
      const un = onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log("Đã đăng nhập, userID:", user.uid);
          if (user.uid !== userId) {
            setUserId(user.uid);
            setUser(user);
            try {
              const favoritesData = await loadFavoritesFood(user.uid);
              setFavoriteItems(favoritesData);
              updateFavorites(favoritesData);
              console.log('Initial favorites loaded:', favoritesData);
            } catch (error) {
              console.error("Error loading favorites:", error);
            }
          }
        } else {
          console.log("Chưa đăng nhập");
          navigation.navigate('LogIn');
        }
      });
      return () => un();
    }, [navigation]);

    // Add effect to monitor favorites changes
    useEffect(() => {
      console.log('Favorites context updated:', favorites);
    }, [favorites]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={20} color={Style.colors.cam} />
              <Text style={styles.locationText}>Giao đến: Hà Nội</Text>
              <Ionicons name="chevron-down" size={20} color={Style.colors.cam} />
            </View>
            
            <TouchableOpacity style={styles.cartIcon} onPress={() => navigation.navigate('Cart')}>
              <MaterialIcons name="shopping-cart" size={24} color={Style.colors.cam} />
              {cartItems.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.searchBar}
            onPress={() => navigation.navigate('SearchScreen')}
          >
            <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
            <Text style={styles.searchText}>Tìm kiếm món ăn...</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.categoryItem,
                  selectedTag === item.tag && styles.selectedCategoryItem
                ]}
                onPress={() => handleTag(item.tag)}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={selectedTag === item.tag ? '#fff' : Style.colors.cam}
                />
                <Text style={[
                  styles.categoryText,
                  selectedTag === item.tag && styles.selectedCategoryText
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <View style={styles.content}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.favorite}>
              <TagComponent />
            </View>

            <View style={styles.foodsContainer}>
              <Loading isLoading={loading} />
              {!loading && (
                filteredFood.length === 0 ? (
                  <Text style={styles.noFoodText}>Chờ cập nhật.</Text>
                ) : (
                  filteredFood.map((item) => (
                    <TouchableOpacity 
                      key={item.id} 
                      style={styles.foodCard}
                      onPress={() => openModal(item)}
                    >
                      <Image source={{ uri: item.foodImage }} style={styles.foodImage} />
                      <View style={styles.foodInfo}>
                        <Text style={styles.foodName}>{item.foodName}</Text>
                        <Text style={styles.foodPrice}>
                          {Number(item.foodPrice).toLocaleString('vi-VN')} đ
                        </Text>
                        <View style={styles.tagContainer}>
                          {Array.isArray(item.tag) && item.tag.map((tag, index) => (
                            <TouchableOpacity 
                              key={index} 
                              style={[
                                styles.tag,
                                tag === selectedTag && styles.selectedTag
                              ]}
                              onPress={() => handleTag(tag)}
                            >
                              <Text style={[
                                styles.tagText,
                                tag === selectedTag && styles.selectedTagText
                              ]}>
                                {tag}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => handleAddToFavorites(item.id)}
                      >
                        <MaterialIcons
                          name="favorite"
                          size={24}
                          color={favorites.includes(item.id) ? Style.colors.cam : '#ccc'}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))
                )
              )}
            </View>
          </ScrollView>
        </View>

        {selectedFood && (
          <FoodItem
            visible={modalVisible}
            foodItem={selectedFood}
            userId={userId}
            onClose={closeModal}
            onAddToCart={handleAddToCart}
          />
        )}
      </SafeAreaView>
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginHorizontal: 4,
    fontSize: 14,
    color: '#333',
  },
  cartIcon: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff5a00',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchBar: {
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
  searchText: {
    color: '#888',
    fontSize: 14,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  categoriesList: {
    paddingHorizontal: 12,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Style.colors.cam,
  },
  selectedCategoryItem: {
    backgroundColor: Style.colors.cam,
  },
  categoryText: {
    marginTop: 4,
    fontSize: 12,
    color: Style.colors.cam,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  favorite: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  foodsContainer: {
    paddingHorizontal: 16,
  },
  noFoodText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
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
  selectedTag: {
    backgroundColor: Style.colors.cam,
  },
  tagText: {
    fontSize: 12,
    color: Style.colors.cam,
  },
  selectedTagText: {
    color: '#fff',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
});

export default HomeScreen