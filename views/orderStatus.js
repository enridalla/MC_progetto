import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import MapView, { Marker, Polyline } from 'react-native-maps';
import useOrderViewModel from '../viewmodels/orderViewModel';


const OrderView = ({ navigation }) => {
  const { isLoading, error, orderStatus, lastOrder, zoomIn, zoomOut, centerMap, getEstimatedTime, pathCoordinates, currentRegion, mapRef } = useOrderViewModel();


  if (error) {
    return (
      <View style={styles.loadingIndicator}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingIndicator}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!lastOrder) {
    return (
      <View style={styles.emptyContainer}>
          <Title style={styles.sectionTitle}>Nessun Ordine Effettuato</Title>
          <Paragraph style={styles.paragraph}>
            Al momento non hai ancora effettuato nessun ordine. Esplora il nostro menu e inizia a ordinare i tuoi piatti preferiti!
          </Paragraph>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Menu')}
            style={styles.button}
          >
            Vai al Menu
          </Button>
    </View>
    );
  }

  if (!orderStatus) {
    return (
      <View style={styles.loadingIndicator}>
        <Text>Loading...</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      {/* Stato dell'ordine */}
      <View style={styles.header}>
        <Text style={styles.statusText}>
          {orderStatus.status === 'ON_DELIVERY' ? 'Ordine in Consegna' : 'Ordine Consegnato'}
        </Text>
        <View style={styles.separator} />
      </View>

      {/* Mappa */}
      <Card style={styles.card}>
        <Title style={styles.sectionTitle}>Tracciamento</Title>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={currentRegion}
        >
          <Marker
            coordinate={{
              latitude: orderStatus.deliveryLocation.lat,
              longitude: orderStatus.deliveryLocation.lng,
            }}
            title="Consegna"
            description="Destinazione finale"
            pinColor="red"
          />
          {orderStatus.status === 'ON_DELIVERY' && (
            <Marker
              coordinate={{
                latitude: orderStatus.currentPosition.lat,
                longitude: orderStatus.currentPosition.lng,
              }}
              title="Drone"
              description="Posizione attuale"
              pinColor="blue"
            />
          )}

        {orderStatus.status === 'ON_DELIVERY' && (
            <Marker
              coordinate={{
                latitude: lastOrder.location.lat,
                longitude: lastOrder.location.lng,
              }}
              title="Ristorante"
              pinColor="green"
            />
          )}

          {/* Linea d'aria solo tra il drone e la destinazione */}
          {orderStatus.status === 'ON_DELIVERY' && (
            <Polyline
              coordinates={pathCoordinates}
              strokeColor="#0000FF"
              strokeWidth={3}
            />
          )}
        </MapView>

        {/* Sezione di controllo unificata */}
        <View style={styles.controlPanel}>
          <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.centerButton} onPress={centerMap}>
            <Text style={styles.buttonText}>Centra</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Dettagli Ordine */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Dettagli Ordine</Title>
          <View style={styles.dataRow}>
            <Paragraph style={styles.label}>Hai ordinato:</Paragraph>
            <Paragraph style={styles.value}>
              {lastOrder?.name} ({lastOrder?.price}€)
            </Paragraph>
          </View>
          <View style={styles.dataRow}>
            <Paragraph style={styles.label}>Stato:</Paragraph>
            <Paragraph style={styles.value}>
              {orderStatus.status === 'ON_DELIVERY' ? 'In Consegna' : 'Consegnato'}
            </Paragraph>
          </View>
          {orderStatus.status === 'ON_DELIVERY' ? (
            <View style={styles.dataRow}>
              <Paragraph style={styles.label}>Tempo stimato:</Paragraph>
              <Paragraph style={styles.value}>{getEstimatedTime()}</Paragraph>
            </View>
          ) : (
            <View style={styles.dataRow}>
              <Paragraph style={styles.label}>Ora di consegna:</Paragraph>
              <Paragraph style={styles.value}>
                {new Date(orderStatus.deliveryTimestamp).toLocaleTimeString()}
              </Paragraph>
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
  statusText: { fontSize: 20, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 8 },
  separator: { width: '50%', height: 2, backgroundColor: '#6554a4', borderRadius: 4, marginBottom: 16 },
  card: { marginBottom: 16, borderRadius: 8, elevation: 2, backgroundColor: '#fff' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8, textAlign: 'center' },
  map: { width: '100%', height: height * 0.4, borderRadius: 8 },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 16, color: '#555' },
  value: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  controlPanel: { position: 'absolute', bottom: 8, right: 16, flexDirection: 'row', zIndex: 1 },
  zoomButton: { backgroundColor: 'rgba(255, 255, 255, 1)', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20, marginRight: 8, alignItems: 'center', justifyContent: 'center' },
  centerButton: { backgroundColor: 'rgba(255, 255, 255, 1)', paddingHorizontal: 10, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#333', fontSize: 14, fontWeight: 'bold' },
  loadingIndicator: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', textAlign: 'center', fontSize: 16, marginTop: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 12,},
  paragraph: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 16, },
  button: { alignSelf: 'center', },
  emptyContainer: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 16, paddingVertical: 24, justifyContent: 'center', alignItems: 'center', },

});

export default OrderView;
