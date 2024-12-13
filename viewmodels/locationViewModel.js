import { useState, useEffect } from 'react';
import { requestLocationPermission, checkPermissionStatus, getCurrentPosition } from '../models/locationModel';

export const useLocationViewModel = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  const fetchLocation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const permissionGranted = await checkPermissionStatus();

      if (!permissionGranted) {
        await requestLocationPermission(); // Tentativo di richiedere i permessi
      }

      const location = await getCurrentPosition();
      setUserLocation(location);
      setHasPermission(true);
    } catch (err) {
      setError(err.message || 'Errore durante la richiesta della posizione');
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return {
    userLocation,
    error,
    isLoading,
    hasPermission,
    fetchLocation,
  };
};
