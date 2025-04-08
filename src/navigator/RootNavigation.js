import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import ScreensNavigation from './ScreensNavigation';

const RootNavigation = () => {
  return (
    <NavigationContainer>
    <ScreensNavigation/>
  </NavigationContainer>
  )
}

export default RootNavigation