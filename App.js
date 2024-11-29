import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuList from './MenuList'; // La lista dei menù
import Profile from './Profile'; // Pagina vuota placeholder
import OrderStatus from './OrderStatus'; // Pagina vuota placeholder

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
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
      </NavigationContainer>
    </PaperProvider>
  );
}
