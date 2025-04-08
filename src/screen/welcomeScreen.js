import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, hr80 } from '../globals/style';
import { useNavigation } from '@react-navigation/native';
import LoginScreen from './logIn';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const timeout = 1000;
  useEffect( () =>{

    const Timer = setTimeout(() => {
      navigation.replace('LogIn');
    }, timeout);

    return () => clearTimeout(Timer);
  }, [navigation])


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
      <View style={styles.background}>
        <Image style={styles.logo} source={require('../../assets/backGround.jpg')} />
      </View>
      <View style={styles.hr80} />
      <Text style={styles.text}>Chào mừng bạn đến với food app</Text>
      <View style={styles.hr80} />

      {/* Button */}
      <TouchableOpacity style={styles.btn} onPress={()=>  navigation.navigate('LogIn')}>
        <Text style={styles.btnText}>Bắt đầu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginVertical: -10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#94f3f7',
  },
  background: {
    width: '80%',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  title: {
    fontSize: 50,
    color: '#FF6347',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.7,
  },
  btn: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  btnText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  hr80: {
    width: '80%',
    borderBottomColor: '#FF6347',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default WelcomeScreen;
