import React, { useEffect, useState } from 'react'
import { 
  Text , 
  View , 
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  FlatList,
  Alert,
 } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import globalStyles from '../globals/globalStyles';
import { useNavigation } from '@react-navigation/native';

import BottomNavigation from '../navigator/BottomNavigation';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons, Feather,FontAwesome5 ,MaterialCommunityIcons} from '@expo/vector-icons';
import Style from '../globals/style';
import style from '../globals/style';
import TagComponent from '../component/TagComponent';
import { addToCart, loadFoodHome, removeFavoritesFood } from '../Firebase/FirebaseAPI';
import Loading from '../component/Loading';
import FoodItem from './FoodItem';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from '@expo/vector-icons/Ionicons';
const categories = [
  { id: 1, name: 'Tất cả', icon: 'food-croissant',tag:'Tất cả' },
  { id: 2, name: 'Đồ chay', icon: 'hamburger' ,tag:'Đồ chay'},
  { id: 3, name: 'Rau củ', icon: 'pizza' ,tag:'Rau củ'},
  { id: 4, name: 'Đồ hộp', icon: 'coffee' ,tag:'Đồ hộp'},
  { id: 5, name: 'Đồ uống', icon: 'cup-water' ,tag:'Đồ uống'},
  { id: 6, name: 'Gia vị', icon: 'noodles',tag:'Gia vị' },   
  { id: 7, name: 'Đồ tráng miệng', icon: 'ice-cream',tag:'Đồ tráng miệng' },  
  { id: 8, name: 'Fast food', icon: 'food-drumstick' ,tag:'Fast food'}, 
  { id: 9, name: 'Đồ ăn', icon: 'food-croissant',tag:'Đồ ăn' },
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
    // const [foodItem,setFoodItem] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [favoriteItems, setFavoriteItems] = useState([]);
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
      if (!userId) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập để thêm vào danh sách yêu thích.");
        return;
      }
      if(favoriteItems.includes(foodId)){
        const result  =  await removeFavoritesFood(userId,foodId);
        if (result.success) {
          Alert.alert("Đã xóa món ăn khỏi danh sách yêu thích", result.message);
          setFavoriteItems(favoriteItems.filter(item => item !== foodId));
        } else {
          Alert.alert("Lỗi", result.message);
        }

      }
      else{
        const result = await addToFavoritesFood(userId, foodId);
        if (result.success) {
          Alert.alert("Đã thêm món ăn vào danh sách yêu thích", result.message);
          setFavoriteItems([...favoriteItems, foodId]);
        } else {
          Alert.alert("Lỗi", result.message);
        }
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
    // const handleFoodItem = (foodItem) =>{
    //   navigation.navigate('FoodItem',{userId,setFoodItem});
    // }

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

    useEffect(() =>{
      const auth = getAuth();
      const un = onAuthStateChanged(auth,(user) =>{
        if(user){
          console.log("Đã đăng nhập, userID:", user.uid);
          if (user.uid !== userId) {
            setUserId(user.uid);
         }
        }
        else{
          console.log("Chưa đăng nhập");
        navigation.navigate('LogIn');
        }
      })
      return () => un();
    },[navigation])
  return (
    <View style={{ flex: 1 }}>
    
    <SafeAreaView style={globalStyles.safeArea}>

    <View style={styles.navSearch}> 
      <View style={styles.searchBar}>
        <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Tìm kiếm sản phẩm"
          style={styles.input}
          placeholderTextColor="#888"
        />
      </View>
      <TouchableOpacity style={styles.cartIcon} 
       onPress={() => navigation.navigate('Cart')}
        
        >
        <MaterialIcons name="shopping-cart" size={24} color={Style.colors.cam} />
      </TouchableOpacity>
      


    
    
     </View>
    <View style={styles.container}>
    <View style={styles.header}>
          <View style={styles.category}></View>
                  <FlatList
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={styles.categoryItem}
                        onPress={()=> handleTag(item.tag)}
                      >
                        <MaterialCommunityIcons
                          name={item.icon}
                          size={40}
                          color='#FFFFFF'
                          style={styles.categoryIcon}
                        />
                        <Text style={styles.categoryText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
           
        </View>
    <View style={styles.content}>
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.favorite}>
            <TagComponent/>
        </View>


    <View style={globalStyles.hr100}></View>
        <View style={styles.main}>
        <Loading isLoading={loading}/>

        {!loading && (filteredFood.length== 0 ?
        (<Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>Chờ cập nhật.</Text>)
        :(filteredFood.map((item) => (
          <TouchableOpacity  key={item.id} style={styles.foodCard} onPress={() => openModal(item)}>
            <View style={{flexDirection:'row'}}>
            <View style={{padding:10}}>
              <Image source={{ uri: item.foodImage }} style={styles.foodImage} />
            </View>
            
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{item.foodName}</Text>
              <Text style={styles.foodPrice}>{Number(item.foodPrice).toLocaleString('vi-VN')} đ</Text>
              <View style={styles.tagContainer}>
                {Array.isArray(item.tag) && item.tag.map((tag, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={[
                      styles.tag, 
                      tag === selectedTag && { backgroundColor: '#ff5a00' }
                    ]}
                    onPress={() => handleTag(tag)}
                  >
                    <Text style={[
                      styles.tagText,
                      tag === selectedTag && { color: '#fff' }
                    ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                  
                ))}
              </View>
            </View>
            <View style={{ right: 10, position: 'absolute' }}>
                  <TouchableOpacity
                    onPress={() => handleAddToFavorites(item.id)}
                    style={{ marginTop: 8 }}
                  >
                    <MaterialIcons
                      name="favorite"
                      size={24}
                      color={favoriteItems.includes(item.id) ? 'pink' : 'black'}
                    />
                  </TouchableOpacity>
                </View>
            </View>
          </TouchableOpacity>
          
        ))
        ))}
        </View>
    </ScrollView>
    </View>
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


  )
}


const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    padding:10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    
    
  },
  content: {
  flex: 1,
  backgroundColor:style.colors.backgroundColor,
              
  justifyContent: 'center',
              
  },
  container:{
    flex: 1,
    backgroundColor:style.colors.backgroundColor,
    justifyContent: 'center',
  },
  icon:{
    marginTop:12,
  },
  navSearch:{
    
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchBar:{
    flex:1,
    flexDirection:'row',
    backgroundColor:'#fff',
    borderRadius:30,
    alignItems:'center',
    paddingHorizontal:10,
    marginLeft:10,
    
  },
  cartIcon: {
    marginLeft: 10,
    marginRight:10,
  },
  searchIcon: {
    marginRight: 6,
  },
  input:{
    flex: 1,
    fontSize: 14,
    color: '#000',
    height:40,
  },
  header:{
    justifyContent:'center',
    backgroundColor: Style.colors.safeColor,
    paddingVertical: 10,
    paddingHorizontal: 10,

    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    
  },
  navContainerView:{
      alignItems:'center',
      
  },
  category:{
    flexDirection:'row',
    justifyContent:'space-between',
  },
  categoryItem:{
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIcon:{
    marginBottom: 5,
  },
  categoryImage:{
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  categoryText:{
    fontSize: 14,
    color: '#FFFFFF',
  },
  nav:{
    backgroundColor: Style.colors.safeColor,
    paddingVertical: 10,
    paddingHorizontal: 10,
    
    height:150,

    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    
    
    
  },
  foodCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 16,
    overflow: 'hidden',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  
  foodImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight:10,
    paddingHorizontal:10,
  },
  
  foodInfo: {
    padding: 10,
  },
  
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  
  foodPrice: {
    marginTop: 4,
    fontSize: 14,
    color: '#ff5a00',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  tag:{
    backgroundColor: '#ffecd2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginTop: 4,
  },
  tagText:{
    fontSize: 12,
    color: '#ff5a00',
    fontWeight: '500',
  }
})

export default HomeScreen