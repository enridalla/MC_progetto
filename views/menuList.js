import React from 'react';
import { FlatList, StyleSheet, View, SafeAreaView } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import useMenuViewModel from '../viewmodels/menuViewModel';

const MenuList = ({ onMenuSelect }) => {
  const { menus } = useMenuViewModel();

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
        <Button mode="contained" onPress={() => onMenuSelect(item)}>
          Acquista
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={menus}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
});

export default MenuList;
