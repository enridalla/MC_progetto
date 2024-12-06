import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomNavigation = ({ currentPage, onChangePage }) => {
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, currentPage === 'menu' && styles.activeTab]}
        onPress={() => onChangePage('menu')}
      >
        <Icon name="food" color={currentPage === 'menu' ? '#6200ee' : 'gray'} size={24} />
        <Text style={[styles.tabText, currentPage === 'menu' && styles.activeText]}>Menù</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, currentPage === 'order' && styles.activeTab]}
        onPress={() => onChangePage('order')}
      >
        <Icon name="truck-delivery" color={currentPage === 'order' ? '#6200ee' : 'gray'} size={24} />
        <Text style={[styles.tabText, currentPage === 'order' && styles.activeText]}>Ordine</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, currentPage === 'profile' && styles.activeTab]}
        onPress={() => onChangePage('profile')}
      >
        <Icon name="account" color={currentPage === 'profile' ? '#6200ee' : 'gray'} size={24} />
        <Text style={[styles.tabText, currentPage === 'profile' && styles.activeText]}>Profilo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f1f1f1',
    position: 'absolute', // Posiziona la tabBar in basso
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1, // Separazione dalla pagina
    borderTopColor: '#ddd',
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6200ee',
  },
  activeText: {
    color: '#6200ee',
  },
  tabText: {
    color: 'gray',
    fontSize: 14,
  },
});

export default BottomNavigation;
