import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';

const OrderView = () => {
  const orderStatus = 'consegnato'; // "in consegna" o "consegnato"

  const restaurantLocation = { latitude: 45.4642, longitude: 9.19 };
  const deliveryLocation = { latitude: 45.4636, longitude: 9.1881 };
  const droneLocation = { latitude: 45.4639, longitude: 9.1895 };

  return (
    <View style={styles.container}>
      {/* Stato dell'ordine */}
      <View style={styles.header}>
        <Text style={styles.statusText}>
          {orderStatus === 'in consegna' ? 'Ordine in Consegna' : 'Ordine Consegnato'}
        </Text>
        <View style={styles.separator} />
      </View>

      {/* Mappa */}
      <Card style={styles.card}>
        <Title style={styles.sectionTitle}>Tracciamento</Title>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: restaurantLocation.latitude,
            longitude: restaurantLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={restaurantLocation}
            title="Ristorante"
            description="Punto di partenza"
            pinColor="green"
          />
          <Marker
            coordinate={deliveryLocation}
            title="Consegna"
            description="Destinazione finale"
            pinColor="red"
          />
          {orderStatus === 'in consegna' && (
            <Marker
              coordinate={droneLocation}
              title="Drone"
              description="Posizione attuale"
              pinColor="blue"
            />
          )}
        </MapView>
      </Card>

      {/* Dettagli Ordine */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Dettagli Ordine</Title>
          <View style={styles.dataRow}>
            <Paragraph style={styles.label}>Menù:</Paragraph>
            <Paragraph style={styles.value}>Pizza Margherita</Paragraph>
          </View>
          <View style={styles.dataRow}>
            <Paragraph style={styles.label}>Stato:</Paragraph>
            <Paragraph style={styles.value}>
              {orderStatus === 'in consegna' ? 'In Consegna' : 'Consegnato'}
            </Paragraph>
          </View>
          {orderStatus === 'in consegna' ? (
            <View style={styles.dataRow}>
              <Paragraph style={styles.label}>Tempo stimato:</Paragraph>
              <Paragraph style={styles.value}>15 minuti</Paragraph>
            </View>
          ) : (
            <View style={styles.dataRow}>
              <Paragraph style={styles.label}>Ora di consegna:</Paragraph>
              <Paragraph style={styles.value}>12:30</Paragraph>
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const { height } = Dimensions.get('window'); // Altezza dello schermo

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 16, paddingVertical: 24 },
  header: { alignItems: 'center', marginBottom: 8 },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  separator: {
    width: '50%',
    height: 2,
    backgroundColor: '#6554a4',
    borderRadius: 4,
    marginBottom: 16,
  },
  card: { marginBottom: 16, borderRadius: 8, elevation: 2, backgroundColor: '#fff' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  map: {
    width: '100%',
    height: height * 0.4, // Altezza proporzionale allo schermo
    borderRadius: 8, // Arrotondamento agli angoli della mappa
  },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 16, color: '#555' },
  value: { fontSize: 16, fontWeight: 'bold', color: '#000' },
});

export default OrderView;
