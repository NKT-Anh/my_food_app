import React, { useRef, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';


const SplashScreen = () => {; 
    return(
        <View style={styles.container}>
            <Image source={require('../../assets/icon_food_app.png')} style={styles.image} /> 

            
        </View>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  image: {
    width:100,
    height:100,
    resizeMode:'cover'
  }
});

export default SplashScreen;
