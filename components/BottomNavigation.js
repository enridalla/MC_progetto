import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomNavigation = ({ currentPage, onChangePage }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onChangePage('menu')}>
        <Icon
          name="food"
          size={30}
          color={currentPage === 'menu' ? '#6200ee' : 'gray'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChangePage('order')}>
        <Icon
          name="truck-delivery"
          size={30}
          color={currentPage === 'order' ? '#6200ee' : 'gray'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChangePage('profile')}>
        <Icon
          name="account"
          size={30}
          color={currentPage === 'profile' ? '#6200ee' : 'gray'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default BottomNavigation;
