import React from 'react';
import { View, Text, StyleSheet,Image,TouchableOpacity } from 'react-native';
// import logo from '../../assets/icon.png';
const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Welcome Screen</Text>
      <View style={styles.logo}>
        <Image source={require('../../assets/backGround.jpg')}/>
      </View>
    <View style={styles.btnLogin}>
    <TouchableOpacity>
        <View>
        <Text style={styles.btnText}>
            Đăng ký
        </Text>
        </View>
    </TouchableOpacity>
</View>
<View style={styles.btnLogin}>
    <TouchableOpacity>
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
      backgroundColor: '#fff',
      
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
    },
    logo: {
      width: 150, 
      height: 150,
      resizeMode: 'contain',
      marginBottom: 40,
    },
    btnLogin: {
      width: '80%',
      height: 50,
      backgroundColor: '#4CAF50', 
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginVertical: 10, 
    },
    btnText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
    },
  });

export default WelcomeScreen;
