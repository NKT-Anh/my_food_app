// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { NavigationContainer } from '@react-navigation/native';
// import {useNavigation} from '@react-navigation/native'
// import Ionicons from '@expo/vector-icons/Ionicons'; // icon đẹp
// import HomeScreen from '../screen/HomeScreen';
// import HomeScreen11 from '../screen/HomeTest';
// const Tab = createBottomTabNavigator();

// export default function MenuNavigation() {
//   return (
    
//     <NavigationContainer>
    
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === 'Home') {
//             iconName = focused
//               ? 'ios-information-circle'
//               : 'ios-information-circle-outline';
//           } else if (route.name === 'Settings') {
//             iconName = focused ? 'ios-list' : 'ios-list-outline';
//           }

//           // You can return any component that you like here!
//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: 'tomato',
//         tabBarInactiveTintColor: 'gray',
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Settings" component={HomeScreen11} />
//     </Tab.Navigator>
//   </NavigationContainer>
// );
// }
