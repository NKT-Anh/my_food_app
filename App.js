import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RootNavigation from './src/navigator/RootNavigation';
import { View } from 'react-native';
import { FavoritesProvider } from './src/Firebase/FavoritesContext';
const Stack = createStackNavigator();

const App = () => {
  return (
    <FavoritesProvider>
      <View style={{ flex: 1 }}>
        <RootNavigation/>
      </View>
    </FavoritesProvider>
  );
};

export default App;
