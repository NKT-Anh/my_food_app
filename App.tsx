import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/screen/splashScreen';
import WelcomeScreen from './src/screen/welcomeScreen';
import LoginScreen from './src/screen/logIn';

const Stack = createStackNavigator();

const App = () => {
  return (
<LoginScreen></LoginScreen>
  );
};

export default App;
