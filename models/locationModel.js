import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Funzione per verificare se i permessi sono stati già concessi
export const checkPermissionStatus = async () => {
  const permissionStatus = await AsyncStorage.getItem('locationPermission');
  return permissionStatus === 'granted'; 
};

// Funzione per richiedere i permessi di posizione e ottenere la posizione
export const requestLocationPermission = async () => {
  try {
    const permissionResponse = await Location.requestForegroundPermissionsAsync();
    
    if (permissionResponse.status === 'granted') {
      await AsyncStorage.setItem('locationPermission', 'granted');
    } else {
      await AsyncStorage.setItem('locationPermission', 'denied');
      throw new Error('Permission not granted');
    }
  } catch (error) {
    console.log('[LocationModel] Error requesting location permission:', error);
    throw error;
  }
};

// Funzione per ottenere la posizione corrente (senza gestire permessi)
export const getCurrentPosition = async () => {
  try {
    const userLocation = await Location.getCurrentPositionAsync();
    return userLocation;
  } catch (error) {
    console.error('[LocationModel] Error getting position:', error);
    throw error; 
  }
};
