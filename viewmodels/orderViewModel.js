import { useEffect, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { getOrderStatus } from '../models/orderModel';

const useOrderViewModel = () => {
  const mapRef = useRef(null);
  const isFocused = useIsFocused();
  const [orderStatus, setOrderStatus] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(0.01);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

    // Calculate the current region only if orderStatus and deliveryLocation are available
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

// define pathCoordinates only if orderStatus and currentPosition exist
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

  return { isLoading, error, orderStatus, zoomIn, zoomOut, centerMap, getEstimatedTime, pathCoordinates, currentRegion, mapRef };
};

export default useOrderViewModel;