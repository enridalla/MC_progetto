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
  const [initialRoute, setInitialRoute] = useState('Menu');

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

  const fetchLastPage = async () => {
    const lastPage = await getLastPage();
    setInitialRoute(lastPage || 'Menu'); // Imposta la pagina iniziale in base all'ultima pagina visitata, menu se non c'è nulla
  }

  // Inizializzazione dell'utente (ad es. recupero SID)
  const initializeUser = async () => {
    try {
      await fetchSID();
    } catch (error) {
      console.log("Errore durante l'inizializzazione dell'utente:", error);
    }
  };

  useEffect(() => {
    initializeUser();

    const checkPermissionScreenStatus = async () => {
      try {
        // Controlla se l'utente ha già premuto "Continua" in una sessione precedente
        const accepted = await AsyncStorage.getItem('hasAcceptedPermissionRequest');
        if (accepted === 'true') {
          // Se l'utente ha già interagito, procede con il recupero della posizione
          setShowPermissionScreen(false);
          fetchLocation();
        } else {
          // Altrimenti mostra sempre la schermata dei permessi
          setShowPermissionScreen(true);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Errore nel controllo della schermata di permessi:", err);
        setIsLoading(false);
      }
    };

    checkPermissionScreenStatus();
    fetchLastPage();
  }, []);

  // Funzione chiamata quando l'utente preme "Continua"
  const handleContinue = async () => {
    // Salva il flag solo quando l'utente preme il bottone
    await AsyncStorage.setItem('hasAcceptedPermissionRequest', 'true');
    setShowPermissionScreen(false);
    setIsLoading(true);
    fetchLocation();
  };

  const saveLastPage = async (pageName) => {
    try {
        await AsyncStorage.setItem('lastPage', pageName);
    } catch (error) {
        console.error('Errore nel salvataggio della pagina:', error);
    }
}

const getLastPage = async () => {
    try {
      const page = await AsyncStorage.getItem('lastPage');
      return page || null;
    } catch (error) {
      console.error('Errore nel recupero della pagina:', error);
      return null;
    }
  };

  return {
    userLocation,
    error,
    isLoading,
    hasLocationPermission,
    showPermissionScreen,
    initialRoute,
    handleContinue,
    saveLastPage,
  };
};
