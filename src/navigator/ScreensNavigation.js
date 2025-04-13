import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screen/welcomeScreen';
import LoginScreen from '../screen/logIn';
import SignInScreen from '../screen/signIn';
import HomeScreen from '../screen/HomeScreen';
import HomeScreen11 from '../screen/HomeTest';
import ForgetPassword from '../screen/forgetPassword';
import AdminScreen from '../admin_app/AdminScreen';
import FoodScreen from '../admin_app/FoodScreen';
import OrderScreen from '../admin_app/OrderScreen';
import StatisticalScreen from '../admin_app/StatisticalScreen';
import UserScreen from '../admin_app/UserScreen';
import AddFood from '../admin_app/Food/AddFood';
const Stack = createNativeStackNavigator();



const ScreensNavigation = () => {
  return (
    <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="LogIn" component={LoginScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen}/>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Home1" component={HomeScreen11}/>
        <Stack.Screen name="ForgetPassword" component={ForgetPassword}/>

        <Stack.Screen name="AdminHome" component={AdminScreen}/>
        <Stack.Screen name="FoodScreen" component={FoodScreen}/>
        <Stack.Screen name="OrderScreen" component={OrderScreen}/>
        <Stack.Screen name="StatisticalScreen" component={StatisticalScreen}/>
        <Stack.Screen name="UserScreen" component={UserScreen}/>
        <Stack.Screen name="AddFood" component={AddFood}/>

      </Stack.Navigator>
  )
}

export default ScreensNavigation