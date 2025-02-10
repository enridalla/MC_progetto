import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuStackNavigator from './MenuStackNavigator';
import OrderStatus from '../views/orderStatus';
import ProfileStackNavigator from './ProfileStackNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = ({ initialRoute }) => (
  <Tab.Navigator
    initialRouteName={initialRoute}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Menu') {
          iconName = 'food';
        } else if (route.name === 'Order') {
          iconName = 'truck-delivery';
        } else if (route.name === 'Profile') {
          iconName = 'account';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#6200ee',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Menu" component={MenuStackNavigator} options={{ title: 'Menù', headerShown: false }} />
    <Tab.Screen name="Order" component={OrderStatus} options={{ title: 'Ordine' }} />
    <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{ title: 'Profilo', headerShown: false }} />
  </Tab.Navigator>
);

export default TabNavigator;
