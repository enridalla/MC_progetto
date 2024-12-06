// /components/MenuList.js
import React from 'react';
import { FlatList, StyleSheet, View, SafeAreaView, Text } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import useMenuViewModel from '../viewmodels/menuViewModel';

const MenuList = () => {
  const { menus, handleMenuSelect } = useMenuViewModel(); // Recupera i menù e la funzione di selezione

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      {item.image ? (
        <Card.Cover source={{ uri: `data:image/jpeg;base64,${item.image}` }} />
      ) : (
        <View style={styles.noImage}><Text>No Image Available</Text></View>
      )}
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>{item.description}</Paragraph>
        <Paragraph>Prezzo: {item.price} €</Paragraph>
        <Paragraph>Consegna: {item.deliveryTime}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => handleMenuSelect(item)}>
          Acquista
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {menus.length === 0 ? ( // Controlla se ci sono menù
        <View style={styles.noData}>
          <Text>Nessun menù disponibile al momento.</Text>
        </View>
      ) : (
        <FlatList
          data={menus}
          renderItem={renderItem}
          keyExtractor={(item) => item.mid.toString()} // Usa 'mid' come identificatore unico
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 10,
  },
  noImage: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MenuList;
