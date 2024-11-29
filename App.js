import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuList from './views/menuList';
import OrderStatus from './views/orderStatus';
import Profile from './views/profile';

const App = () => {
  const [currentPage, setCurrentPage] = useState('menu'); // Stato per gestire la pagina corrente

  // Funzione per cambiare la pagina
  const changePage = (page) => {
    setCurrentPage(page);
  };

  // Renderizza la pagina attuale in base allo stato
  const renderPage = () => {
    switch (currentPage) {
      case 'menu':
        return <MenuList />;
      case 'order':
        return <OrderStatus />;
      case 'profile':
        return <Profile />;
      default:
        return <MenuList />;
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeAreaView}>
        {/* Contenuto della pagina */}
        <View style={styles.pageContainer}>
          {renderPage()}
        </View>

        {/* Barra di navigazione con tab */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, currentPage === 'menu' && styles.activeTab]}
            onPress={() => changePage('menu')}
          >
            <Icon name="food" color={currentPage === 'menu' ? '#6200ee' : 'gray'} size={24} />
            <Text style={[styles.tabText, currentPage === 'menu' && styles.activeText]}>Menù</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, currentPage === 'order' && styles.activeTab]}
            onPress={() => changePage('order')}
          >
            <Icon name="truck-delivery" color={currentPage === 'order' ? '#6200ee' : 'gray'} size={24} />
            <Text style={[styles.tabText, currentPage === 'order' && styles.activeText]}>Ordine</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, currentPage === 'profile' && styles.activeTab]}
            onPress={() => changePage('profile')}
          >
            <Icon name="account" color={currentPage === 'profile' ? '#6200ee' : 'gray'} size={24} />
            <Text style={[styles.tabText, currentPage === 'profile' && styles.activeText]}>Profilo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    // Rimuoviamo ogni padding extra che potrebbe spingere il contenuto in alto
  },
  pageContainer: {
    flex: 1,
    paddingBottom: 60, // Spazio per la barra delle tab
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f1f1f1',
    position: 'absolute', // Posiziona la tabBar in basso
    bottom: 0, // Ancorata al fondo
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

export default App;
