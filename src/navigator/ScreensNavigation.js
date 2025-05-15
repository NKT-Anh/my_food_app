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
import CartScreen from '../screen/CartScreen';
import Profile from '../screen/profile/Profile';

import ProfileDetail from '../screen/profile/ProfileDetail';
import FoodItem from '../screen/FoodItem';
import Cart from '../screen/Cart/Cart';
import Favorites from '../screen/Favorites/Favorites';
import ShippingOrders from '../screen/Orders/ShippingOrders';
import CompletedOrders from '../screen/Orders/CompletedOrders';
import PendingOrders from '../screen/Orders/PendingOrders';
import InProgressOrders from '../screen/Orders/InProgressOrders';
import Order from '../screen/Cart/Order';
import HomeShipper from '../Shipper/HomeShipper';
import UpdateRestaurantScreen from '../admin_app/UpdateRestaurantScreen';
import SearchScreen from '../screen/SearchScreen';
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
        

        <Stack.Screen name="AdminHome" component={AdminScreen}/>
        <Stack.Screen name="FoodScreen" component={FoodScreen}/>
        <Stack.Screen name="OrderScreen" component={OrderScreen}/>
        <Stack.Screen name="StatisticalScreen" component={StatisticalScreen}/>
        <Stack.Screen name="UpdateRestaurantScreen" component={UpdateRestaurantScreen}/>
        <Stack.Screen name="UserScreen" component={UserScreen}/>
        <Stack.Screen name="Favorites" component={Favorites}/>

        <Stack.Screen name="ForgetPassword" component={ForgetPassword}/>
        <Stack.Screen name="Profile" component={Profile}/>
        <Stack.Screen name="ProfileDetail" component={ProfileDetail}/>

        <Stack.Screen name="SearchScreen" component={SearchScreen}/>
        <Stack.Screen name="CartScreen" component={CartScreen} options={{ title: 'Giỏ Hàng' }} />
        
        <Stack.Screen name="AddFood" component={AddFood}/>
        <Stack.Screen name="FoodItem" component={FoodItem}/>
        <Stack.Screen name="Cart" component={Cart} options={{ title: 'Giỏ Hàng' }}/>
        
        <Stack.Screen name="PendingOrders" component={PendingOrders} options={{ title: 'Chờ xác nhận' }} />
        <Stack.Screen name="ShippingOrders" component={ShippingOrders} options={{ title: 'Chờ giao hàng' }} />
        <Stack.Screen name="CompletedOrders" component={CompletedOrders} options={{ title: 'Đã đặt' }} />
        <Stack.Screen name="InProgressOrders" component={InProgressOrders} options={{ title: 'Đang giao' }} />
         <Stack.Screen name="Order" component={Order} options={{ title: 'Trạng thái đơn hàng' }} />
          <Stack.Screen name="HomeShipper" component={HomeShipper} options={{ title: 'Nhận đơn hàng' }} />

      </Stack.Navigator>
  )
}

export default ScreensNavigation