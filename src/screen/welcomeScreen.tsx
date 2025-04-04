import React from 'react';
import { View, Text, StyleSheet,Image,ImageBackground,TouchableOpacity } from 'react-native';
// import logo from '../../assets/icon.png';
import {colors , hr80} from '../globals/style'
const WelcomeScreen = () => {
  return (

    <View style={styles.container}>
      <Text style={styles.title}>This is the Welcome Screen</Text>
      <View style={styles.background} >
        <Image style={styles.logo}  source={require('../../assets/backGround.jpg')}/>
      </View>
      <View style={styles.hr80}/>
      <Text style={styles.text}> hello cu</Text>
      <View style={styles.hr80}/>

    <View style={styles.btn}>
    <TouchableOpacity style={styles.btnLogin}>
        <View>
        <Text style={styles.btnText}>
            Đăng ký
        </Text>
        </View>
    </TouchableOpacity>

      <TouchableOpacity style={styles.btnLogin}>
        <View>
        <Text style={styles.btnText}>
           Đăng nhập
        </Text>
        </View>
    </TouchableOpacity>
    </View>
    
    
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width:'100%',

      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#94f3f7',
      
    },
    background:{
      width:'80%',
      height:'30%',
      // justifyContent:'center',
      alignItems:'center',
      // resizeMode:'cover',
    },
    title:{
      fontSize: 50,
      color:'red',
      textAlign:'center',
      marginVertical:10,
      fontWeight:'200',
    },
    text: {
      fontSize: 24,
      textAlign:'center',
      fontWeight: 'bold',
      color: 'white',

    },
    logo: {
      width: '100%', 
      height: '100%',
      // resizeMode: 'center',
      //marginBottom: 40,
    },
    btn:{
      flexDirection:'row',
      alignItems: 'center',
      justifyContent: 'center',
      width:'100%',
      paddingHorizontal: 20,
      marginTop: 20,  
    },
    btnLogin: {
      width:'40%',
      backgroundColor: '#007AFF', 
      alignItems: 'center',
      marginHorizontal:10,
      borderRadius: 10,
      marginVertical: 30, 
      padding:10,
      paddingVertical: 12,
      paddingHorizontal:10,
      // shadowColor: '#000',
      // shadowOpacity: 0.2,
      // shadowOffset: { width: 0, height: 2 },
      // shadowRadius: 4,
      // elevation: 5,
    },
    btnText: {
      fontSize: 18,
      textAlign:'center',
      fontWeight: 'bold',
      color: '#94f3f7',
    },
    hr80:{
      width:'80%',
      borderBottomColor: 'black',
      borderBottomWidth:1,
      marginVertical:10, 
      
    }
  });

export default WelcomeScreen;
