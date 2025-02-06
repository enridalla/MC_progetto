import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import { getOrderStatus } from '../models/orderModel';

const OrderView = () => {
  const mapRef = useRef(null);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(0.01);

  useEffect(() => {
    let interval = null;

    const fetchOrderStatus = async () => {
      try {
        const status = await getOrderStatus();
        setOrderStatus(status);

        if (status.status === "COMPLETED" && interval) {
          clearInterval(interval);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isFocused) return;
    fetchOrderStatus();
    interval = setInterval(fetchOrderStatus, 5000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFocused]);

  if (error) {
    return (
      <View style={styles.loadingIndicator}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (isLoading || !orderStatus) {
    return (
      <View style={styles.loadingIndicator}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Funzione per calcolare la regione corrente da passare a MapView e animateToRegion
  const currentRegion = {
    latitude: orderStatus.deliveryLocation.lat,
    longitude: orderStatus.deliveryLocation.lng,
    latitudeDelta: zoomLevel,
    longitudeDelta: zoomLevel,
  };

  // Funzione per lo zoom-in
  const zoomIn = () => {
    const newZoom = zoomLevel / 2;
    if (newZoom < 0.001) {
      console.log("Zoom in raggiunto il limite minimo.");
      return;
    }
    setZoomLevel(newZoom);
    if (mapRef.current) {
      setZoomLevel((prevZoom) => Math.max(prevZoom / 2, 0.002));
    }
  };

  // Funzione per lo zoom-out
  const zoomOut = () => {
    const newZoom = zoomLevel * 2;
    if (newZoom > 100) {
      console.log("Zoom out raggiunto il limite massimo.");
      return;
    }
    setZoomLevel(newZoom);
    if (mapRef.current) {
      setZoomLevel((prevZoom) => Math.min(prevZoom * 2, 1));
    }
  };

  // Funzione per centrare la mappa sulla posizione attuale del drone
  const centerMap = () => {
    if (!mapRef.current || !orderStatus) return;
  
    if (orderStatus.status === 'COMPLETED') {
      // Centra sulla posizione di consegna mantenendo lo zoom attuale
      mapRef.current.animateToRegion({
        latitude: orderStatus.deliveryLocation.lat,
        longitude: orderStatus.deliveryLocation.lng,
        latitudeDelta: zoomLevel,
        longitudeDelta: zoomLevel,
      }, 300);
    } else if (orderStatus.status === 'ON_DELIVERY' && orderStatus.currentPosition) {
      // Centra sul percorso tra il drone e la destinazione
      const positions = [
        {
          latitude: orderStatus.currentPosition.lat,
          longitude: orderStatus.currentPosition.lng,
        },
        {
          latitude: orderStatus.deliveryLocation.lat,
          longitude: orderStatus.deliveryLocation.lng,
        },
      ];
      mapRef.current.fitToCoordinates(positions, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  // Funzione per stimare il tempo di consegna
  const getEstimatedTime = () => {
    const now = new Date();
    const expectedTime = new Date(orderStatus.expectedDeliveryTimestamp);
    const diffMinutes = Math.max(0, Math.round((expectedTime - now) / 60000));
    return `${diffMinutes} minuti`;
  };

  // Linea d'aria tra il drone e la destinazione (utente)
  const pathCoordinates = [
    {
      latitude: orderStatus.currentPosition.lat,
      longitude: orderStatus.currentPosition.lng,
    },
    {
      latitude: orderStatus.deliveryLocation.lat,
      longitude: orderStatus.deliveryLocation.lng,
    }
  ];

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
          // Rimuoviamo onRegionChangeComplete per evitare conflitti con animateToRegion
          // onRegionChangeComplete={(newRegion) => setCenter({latitude: newRegion.latitude, longitude: newRegion.longitude})}
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
});

export default OrderView;
