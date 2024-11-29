// /components/MenuList.js
import React from 'react';
import { FlatList, StyleSheet, View, SafeAreaView, Text, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import useMenuViewModel from '../viewmodels/menuViewModel';

const MenuList = ({ onMenuSelect }) => {
  const { menus, loading } = useMenuViewModel();

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
        <Button mode="contained" onPress={() => onMenuSelect(item)}>
          Acquista
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#FF7300" /> {/* Mostra un indicatore di caricamento */}
        <Text>Caricamento in corso...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={menus}
        renderItem={renderItem}
        keyExtractor={(item) => item.mid.toString()} // Usa 'mid' come identificatore unico
      />
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
});

export default MenuList;
