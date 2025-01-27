import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, ActivityIndicator } from 'react-native';
import TabNavigator from './components/TabNavigator';
import { requestLocationPermission, checkPermissionStatus, getCurrentPosition } from './models/locationModel';
import { fetchSID } from './models/profileModel';


const App = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);

  const fetchLocation = async () => {
    setIsLoading(true);
    setError(null);
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

  const initializeUser = async () => {
    try {
      await fetchSID(); 
    } catch (error) {
      console.log('Errore durante l’inizializzazione dell’utente:', error);
    }
  };

  useEffect(() => {
    initializeUser();
    fetchLocation();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (hasLocationPermission === false) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorMessage}>
          Questa app richiede l'accesso alla posizione per funzionare correttamente.
        </Text>
      </View>
    );
  }

  if (hasLocationPermission === null) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Controllo dei permessi...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorMessage}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <TabNavigator userLocation={userLocation} />
    </NavigationContainer>
  );
};

const styles = {
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
};

export default App;
