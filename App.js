import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuList from './views/menuList';
import MenuDetails from './views/menuDetails';
import OrderStatus from './views/orderStatus';
import Profile from './views/profile';

// Stack Navigator per il menù
const MenuStack = createNativeStackNavigator();

const MenuStackScreen = () => (
  <MenuStack.Navigator>
    <MenuStack.Screen name="MenuList" component={MenuList} options={{ title: 'Menù' }} />
    <MenuStack.Screen name="MenuDetails" component={MenuDetails} options={{ title: 'Dettagli Menù' }} />
  </MenuStack.Navigator>
);

// Tab Navigator
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
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
        <Tab.Screen name="Menu" component={MenuStackScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Order" component={OrderStatus} options={{ title: 'Stato Ordine' }} />
        <Tab.Screen name="Profile" component={Profile} options={{ title: 'Profilo' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
