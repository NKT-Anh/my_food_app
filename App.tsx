import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RootNavigation from './src/navigator/RootNavigation';
const Stack = createStackNavigator();

const App = () => {
  return (
    <RootNavigation/>
  );
};

export default App;
