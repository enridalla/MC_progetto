import React, { useEffect } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { useLocationViewModel } from '../viewmodels/locationViewModel';

const LocationScreen = () => {
  const { userLocation, error, isLoading, fetchLocation, getPosition, hasPermission } = useLocationViewModel();

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : userLocation ? (
        <Text>Location: {JSON.stringify(userLocation)}</Text>
      ) : (
        <View>
          {hasPermission === null ? (
            <Text>Loading permissions...</Text>
          ) : !hasPermission ? (
            <Text>Permission denied. Please enable location access in settings.</Text>
          ) : (
            <View>
              <Button title="Get Location with Permissions" onPress={fetchLocation} />
              <Button title="Get Current Position" onPress={getPosition} />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default LocationScreen;
