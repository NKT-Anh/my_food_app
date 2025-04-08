import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import WelcomeScreen from '../screen/welcomeScreen';
import LoginScreen from '../screen/logIn';
import SignInScreen from '../screen/signIn';
import HomeScreen from '../screen/HomeScreen';

const Stack = createNativeStackNavigator();



const AuthNavigation = () => {
  return (
    <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="LogIn" component={LoginScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen}/>
        <Stack.Screen name="Home" component={HomeScreen}/>

      </Stack.Navigator>
  )
}

export default AuthNavigation