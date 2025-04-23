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
import { loadFoodHome } from '../Firebase/FirebaseAPI';
import Loading from '../component/Loading';
import { red } from '@cloudinary/url-gen/actions/adjust';
import { center } from '@cloudinary/url-gen/qualifiers/textAlignment';

import { searchName } from '../Firebase/FirebaseAPI';
const SearchScreen = () => {

    const navigation = useNavigation();
    const [keyWord,setKeyWord] = useState('');
    const [result,setResult] = useState([]);
    const [loading,setLoading] = useState(false);

  return (
    <View style={{flex:1}}>
    <SafeAreaView style={styles.safeArea}>
            <View style={styles.navSearch}> 
            <TouchableOpacity style={styles.cartIcon} 
       onPress={() => navigation.goBack()}
        
        >
        <Ionicons name="arrow-back-outline" size={24} color={Style.colors.cam} />
      </TouchableOpacity>

      <View style={styles.searchBar}>
        <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Tìm kiếm sản phẩm"
          style={styles.input}
          placeholderTextColor="#888"
        />

      </View>



    
    
     </View>
     <View style={styles.container}>
        <View style={styles.main}>
            <View style={styles.foodPanel}>

            </View>

            <View style={styles.foodPanel}>

        </View>
            
        </View>
    </View>
    </SafeAreaView>
    </View>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
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
        borderWidth:2,
        borderColor:"#FFC107",
        
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
        // backgroundColor: Style.colors.safeColor,
        paddingVertical: 10,
        paddingHorizontal: 10,
    
        borderBottomLeftRadius: 45,
        borderBottomRightRadius: 45,
        
    },
    container:{
        flex: 1,
        marginTop:5,
        //   backgroundColor:style.colors.backgroundColor,
        backgroundColor:'blue',
        justifyContent: 'center',
    },
    safeArea: {
        backgroundColor: 'white',
        flex: 1,
    },
    main:{
        flex:1,
        marginTop:10,
        backgroundColor:'pink',
        paddingHorizontal:10,
        flexDirection:'row',
        justifyContent:'space-between'
        
    },
    foodPanel:{
        backgroundColor:'red',
        width:'40%',
        height:'20%',
        margin:10,
    }

      
})