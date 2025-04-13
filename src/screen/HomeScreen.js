import React, { useState } from 'react'
import { 
  Text , 
  View , 
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  FlatList
 } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import globalStyles from '../globals/globalStyles';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import BottomNavigation from '../navigator/BottomNavigation';
import MenuNavigation from '../navigator/MenuNavigation';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons, Feather,FontAwesome5 } from '@expo/vector-icons';
import Style from '../globals/style';
import style from '../globals/style';
import TagComponent from '../component/TagComponent';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from '@expo/vector-icons/Ionicons';
const categories = [
  { id: 1, name: 'Bữa sáng', icon: 'food-croissant' },
  { id: 2, name: 'Bánh mỳ', icon: 'hamburger' },
  { id: 3, name: 'Pizza', icon: 'pizza' },
  { id: 4, name: 'Cà phê', icon: 'coffee' },
  { id: 5, name: 'Đồ uống', icon: 'cup-water' },
  { id: 6, name: 'Mỳ', icon: 'noodles' },   
  { id: 7, name: 'Kem', icon: 'ice-cream' },  
  { id: 8, name: 'Gà lướng', icon: 'food-drumstick' }, 
];

const HomeScreen = () => {
    const navigation = useNavigation();
    const [menu,showMenu] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

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
      <TouchableOpacity style={styles.cartIcon}>
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
                      <TouchableOpacity style={styles.categoryItem}>
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
    <ScrollView>
        <View style={styles.favorite}>
            <TagComponent/>
        </View>
    <View style={globalStyles.hr100}></View>
        <View style={styles.main}>

        </View>
    </ScrollView>
    </View>
    </View>
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
})

export default HomeScreen