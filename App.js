import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './components/TabNavigator';
import { requestLocationPermission, checkPermissionStatus, getCurrentPosition } from './models/locationModel';
import { fetchSID } from './models/profileModel';

const App = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

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

  const initializeUser = async () => {
    try {
      await fetchSID(); 
    } catch (error) {
      console.log('Errore durante l’inizializzazione dell’utente:', error);
    }
  };

  useEffect(() => {
    initializeUser();
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          // Primo avvio
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('hasLaunched', 'true');
          setIsLoading(false);
        } else {
          // Non è il primo avvio: procedo subito con la richiesta della posizione
          setIsFirstLaunch(false);
          fetchLocation();
        }
      } catch (err) {
        console.error('Errore nel controllo del primo avvio:', err);
        setIsLoading(false);
      }
    };

    checkFirstLaunch();
  }, []);

  // Funzione chiamata quando l'utente preme "Continua" nella schermata esplicativa
  const handleContinue = () => {
    setIsFirstLaunch(false);
    setIsLoading(true);
    fetchLocation();
  };

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (isFirstLaunch) {
    return (
      <View style={styles.centeredContainer}>
        <Icon name="location-on" size={100} color="#007AFF" style={styles.icon} />
        <Text style={styles.titleText}>Accesso alla Posizione Necessario</Text>
        <Text style={styles.descriptionText}>
          Per una migliore esperienza, questa app ha bisogno di accedere alla tua posizione.
        </Text>
        <Button mode="contained" style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continua</Text>
        </Button>
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

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorMessage}>Errore: {error}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <TabNavigator userLocation={userLocation} />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  centeredContainer: { flex: 1, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', padding: 20 },
  icon: { marginBottom: 20, color: '#6554a4' },
  titleText: { fontSize: 26, fontWeight: '600', color: '#333', marginBottom: 10, textAlign: 'center' },
  descriptionText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30, lineHeight: 24 },
  button: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '500' },
  errorMessage: { fontSize: 18, color: '#D8000C', textAlign: 'center', marginBottom: 20 },
});

export default App;
