// viewmodels/useAppViewModel.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestLocationPermission, checkPermissionStatus, getCurrentPosition } from '../models/locationModel';
import { fetchSID } from '../models/profileModel';

export const useAppViewModel = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [showPermissionScreen, setShowPermissionScreen] = useState(false);
  const [initialNavigationState, setInitialNavigationState] = useState();

  useEffect(() => {
    initializeUser();

    const initializeApp = async () => {
      // Load navigation state first
      const savedState = await loadNavigationState();
      if (savedState) {
        setInitialNavigationState(savedState);
      }

      // Then check permissions
      try {
        const accepted = await AsyncStorage.getItem('hasAcceptedPermissionRequest');
        if (accepted === 'true') {
          setShowPermissionScreen(false);
          await fetchLocation();
        } else {
          setShowPermissionScreen(true);
        }
      } catch (err) {
        console.error("Error initializing app:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Funzione per richiedere e ottenere la posizione
  const fetchLocation = async () => {
    try {
      const permissionGranted = await checkPermissionStatus();
      if (!permissionGranted) {
        await requestLocationPermission();
      }
      setHasLocationPermission(true);
      const location = await getCurrentPosition();
      setUserLocation(location);
    } catch (err) {
      setError(err.message || 'Errore durante la richiesta della posizione');
      setHasLocationPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Inizializzazione dell'utente (ad es. recupero SID)
  const initializeUser = async () => {
    try {
      await fetchSID();
    } catch (error) {
      console.log("Errore durante l'inizializzazione dell'utente:", error);
    }
  };

  // Funzione chiamata quando l'utente preme "Continua"
  const handleContinue = async () => {
    // Salva il flag solo quando l'utente preme il bottone
    await AsyncStorage.setItem('hasAcceptedPermissionRequest', 'true');
    setShowPermissionScreen(false);
    setIsLoading(true);
    fetchLocation();
  };

  // Modified saveLastPage to save entire navigation state
  const saveNavigationState = async (state) => {
    try {
      const serializedState = JSON.stringify(state);
      await AsyncStorage.setItem('navigationState', serializedState);
    } catch (error) {
      console.log('Error saving navigation state:', error);
    }
  };

  // Function to load saved navigation state
  const loadNavigationState = async () => {
    try {
      const serializedState = await AsyncStorage.getItem('navigationState');
      return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (error) {
      console.log('Error loading navigation state:', error);
      return undefined;
    }
  };

  return {
    userLocation,
    error,
    isLoading,
    hasLocationPermission,
    showPermissionScreen,
    initialNavigationState,
    handleContinue,
    saveNavigationState,
  };
};
