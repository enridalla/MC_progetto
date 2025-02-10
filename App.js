import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './components/TabNavigator';
import { useAppViewModel } from './viewmodels/appViewModel';

const App = () => {
  const {
    userLocation,
    error,
    isLoading,
    hasLocationPermission,
    showPermissionScreen,
    initialRoute,
    handleContinue,
    saveLastPage,
  } = useAppViewModel();

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (showPermissionScreen) {
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
    <NavigationContainer
      onStateChange={async (state) => {
        const currentRoute = state?.routes[state.index]?.name;
        if(currentRoute) {
          await saveLastPage(currentRoute)
        }
      }}
    >
      <TabNavigator initialRoute={initialRoute} userLocation={userLocation} />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  centeredContainer: { flex: 1, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', padding: 20 },
  icon: { marginBottom: 20, color: '#6554a4' },
  titleText: { fontSize: 26, fontWeight: '600', color: '#333', marginBottom: 10, textAlign: 'center' },
  descriptionText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30, lineHeight: 24 },
  button: { backgroundColor: '#6554a4', marginTop: 20 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '500' },
  errorMessage: { fontSize: 18, color: '#D8000C', textAlign: 'center', marginBottom: 20 },
});

export default App;
