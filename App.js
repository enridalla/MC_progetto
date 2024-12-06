import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import MenuList from './views/menuList';
import OrderStatus from './views/orderStatus';
import Profile from './views/profile';
import BottomNavigation from './components/BottomNavigation';

const App = () => {
  const [currentPage, setCurrentPage] = useState('menu'); // Stato per gestire la pagina corrente

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

        {/* Barra di navigazione */}
        <BottomNavigation currentPage={currentPage} onChangePage={setCurrentPage} />
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
    paddingBottom: 60, // Spazio per la barra delle tab
  },
});

export default App;
