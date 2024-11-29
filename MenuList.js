import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

const sampleMenus = [
  {
    id: '1',
    name: 'Pizza Margherita',
    description: 'Pomodoro, mozzarella, basilico fresco.',
    price: '€10.99',
    deliveryTime: '15 minuti',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    name: 'Sushi Combo',
    description: '12 pezzi di sushi assortito.',
    price: '€18.50',
    deliveryTime: '20 minuti',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    name: 'Burger Classico',
    description: 'Hamburger con patatine fritte.',
    price: '€12.00',
    deliveryTime: '10 minuti',
    image: 'https://via.placeholder.com/150',
  },
];

export default function MenuList() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    // Simula il caricamento dei dati
    setMenus(sampleMenus);
  }, []);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: item.image }} />
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>{item.description}</Paragraph>
        <Paragraph>Prezzo: {item.price}</Paragraph>
        <Paragraph>Consegna: {item.deliveryTime}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => alert(`Acquistato: ${item.name}`)}>
          Acquista
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={menus}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 10,
  },
});
