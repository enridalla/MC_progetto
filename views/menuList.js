import React, { useState } from 'react';
import { FlatList, StyleSheet, View, SafeAreaView, Text } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import useMenuViewModel from '../viewmodels/menuViewModel';
import MenuDetails from './menuDetails';

const MenuList = ({ onChangePage }) => {
  const { menus, loading, error } = useMenuViewModel();
  const [selectedMenu, setSelectedMenu] = useState(null);

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Caricamento in corso...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>Errore: {error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => setSelectedMenu(item.mid)} // Aggiungi questa riga per navigare ai dettagli
    >
      {item.image ? (
        <Card.Cover
          source={{ uri: `data:image/jpeg;base64,${item.image}` }}
          style={styles.cardImage}
          resizeMode="cover" // Assicurati che l'immagine riempia correttamente
        />
      ) : (
        <View style={styles.noImage}><Text style={styles.noImageText}>No Image Available</Text></View>
      )}
      <Card.Content>
        <Title style={styles.cardTitle}>{item.name}</Title>
        <Paragraph style={styles.cardDescription}>{item.shortDescription}</Paragraph>
        <Paragraph style={styles.cardPrice}>Prezzo: {item.price} €</Paragraph>
        <Paragraph style={styles.cardDelivery}>Consegna: {item.deliveryTime} minuti</Paragraph>
      </Card.Content>
    </Card>
  );

  if (selectedMenu) {
    return (
      <MenuDetails
        menuId={selectedMenu}
        onBack={() => {
          setSelectedMenu(null);
          onChangePage('menu');
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={menus}
        renderItem={renderItem}
        keyExtractor={(item) => item.mid.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  card: {
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 5,  // Shadow effect for iOS
    shadowColor: '#000', // Shadow effect for Android
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    height: 200, // Imposta l'altezza dell'immagine
    borderRadius: 8, // Angoli arrotondati per l'immagine
    marginBottom: 8, // Riduci la distanza tra l'immagine e gli altri elementi
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0799ED',
    marginBottom: 8,
  },
  cardDelivery: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  noImage: { 
    height: 200, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#ddd', 
    borderRadius: 8,
  },
  noImageText: { 
    color: '#555', 
    fontStyle: 'italic',
  },
  loading: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  loadingText: { 
    fontSize: 16, 
    fontWeight: '600', 
  },
  error: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  errorText: { 
    fontSize: 16, 
    color: 'red', 
    fontWeight: '600',
  },
});

export default MenuList;
