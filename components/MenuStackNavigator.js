import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuList from '../views/menuList';
import MenuDetails from '../views/menuDetails';

const MenuStack = createNativeStackNavigator();

const MenuStackNavigator = () => (
  <MenuStack.Navigator>
    <MenuStack.Screen name="MenuList" component={MenuList} options={{ title: 'Menù' }} />
    <MenuStack.Screen name="MenuDetails" component={MenuDetails} options={{ title: 'Dettagli Menù' }} />
  </MenuStack.Navigator>
);

export default MenuStackNavigator;
