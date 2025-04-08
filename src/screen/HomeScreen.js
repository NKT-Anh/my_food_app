import React, { useState } from 'react'
import { Text , View , StyleSheet,TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import globalStyles from '../globals/globalStyles';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const HomeScreen = () => {
    const navigation = useNavigation();
    const [menu,showMenu] = useState(false);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
    <View style={styles.navBar}> 
    <MaterialCommunityIcons style={styles.icon} name="account-details" size={30} color="white" />
    <TouchableOpacity onPress={()=> navigation.navigate('Home')}>
    <Text  style={globalStyles.navTitle}>Trang Chủ</Text>
    </TouchableOpacity>
    <MaterialCommunityIcons 
    style={styles.icon}
    name= {menu == true ? "menu-left-outline" : "menu-right-outline"} size={30} color="white" 
    onPress={()=> showMenu(!menu)}
    />

    </View>
    <View style={globalStyles.container}>
        <View>
            

           
        </View>
    </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    height: 50,
  },
  icon:{
    marginTop:12,
  }

})

export default HomeScreen