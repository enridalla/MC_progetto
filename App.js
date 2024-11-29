import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuList from './views/menuList'; 
import OrderStatus from './views/orderStatus'; 
import Profile from './views/profile'; 

const Tab = createBottomTabNavigator();

const App = () => {
  const [currentPage, setCurrentPage] = useState('menu');

  const changePage = (page) => {
    setCurrentPage(page);  
  };

  return (
    <PaperProvider>
      <NavigationContainer>
        <View style={{ flex: 1 }}>
          {currentPage === "menu" && (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                  let iconName;
                  if (route.name === 'Menù') {
                    iconName = 'food';
                  } else if (route.name === 'Ordine') {
                    iconName = 'truck-delivery';
                  } else if (route.name === 'Profilo') {
                    iconName = 'account';
                  }
                  return <Icon name={iconName} color={color} size={size} />;
                },
                tabBarActiveTintColor: '#6200ee',
                tabBarInactiveTintColor: 'gray',
              })}
            >
              <Tab.Screen name="Menù" component={MenuList} />
              <Tab.Screen name="Ordine" component={OrderStatus} />
              <Tab.Screen name="Profilo" component={Profile} />
            </Tab.Navigator>
          )}
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
