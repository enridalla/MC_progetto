import { useEffect, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { getOrderStatus, getLastOrder } from '../models/orderModel';

const useOrderViewModel = () => {
  const mapRef = useRef(null);
  const isFocused = useIsFocused();
  const [orderStatus, setOrderStatus] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utilizziamo un valore costante per il livello di zoom
  const zoomLevel = 0.01;

  useEffect(() => {
    let interval = null;

    const fetchOrderStatus = async () => {
      try {
        const order = await getLastOrder();
        if (!order) {
          setIsLoading(false);
          return;
        }
        setLastOrder(order);

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

  useEffect(() => {
    centerMap();
  }, [orderStatus?.status]);

  // Calcola la regione corrente solo se orderStatus e deliveryLocation sono disponibili
  const currentRegion = orderStatus && orderStatus.deliveryLocation ? {
    latitude: orderStatus.deliveryLocation.lat,
    longitude: orderStatus.deliveryLocation.lng,
    latitudeDelta: zoomLevel,
    longitudeDelta: zoomLevel,
  } : {
    latitude: 0,
    longitude: 0,
    latitudeDelta: zoomLevel,
    longitudeDelta: zoomLevel,
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

  // Definisce pathCoordinates solo se orderStatus e currentPosition sono disponibili
  const pathCoordinates = orderStatus && orderStatus.currentPosition && orderStatus.deliveryLocation ? [
    {
      latitude: orderStatus.currentPosition.lat,
      longitude: orderStatus.currentPosition.lng,
    },
    {
      latitude: orderStatus.deliveryLocation.lat,
      longitude: orderStatus.deliveryLocation.lng,
    }
  ] : [];

  return { 
    isLoading, 
    error, 
    orderStatus, 
    lastOrder, 
    setLastOrder, 
    centerMap, 
    getEstimatedTime, 
    pathCoordinates, 
    currentRegion, 
    mapRef 
  };
};

export default useOrderViewModel;
