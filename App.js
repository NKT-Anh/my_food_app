import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RootNavigation from './src/navigator/RootNavigation';
import { View } from 'react-native';
const Stack = createStackNavigator();

const App = () => {
  return (
    <View style={{ flex: 1 }}>
    <RootNavigation/>

    </View>
  );
};

export default App;
