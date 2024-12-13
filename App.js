import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, ActivityIndicator } from 'react-native';
import { useLocationViewModel } from './viewmodels/locationViewModel';  
import TabNavigator from './components/TabNavigator';

const App = () => {
  const { error, isLoading, hasPermission } = useLocationViewModel();

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (hasPermission === false) {
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
        <Text style={styles.errorMessage}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

const styles = {
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20
  }
};

export default App;
