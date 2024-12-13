// viewModels/locationViewModel.js
import { useState } from 'react';
import { requestLocationPermission, getCurrentPosition } from '../models/useLocation';

const useLocationViewModel = () => {
  const [location, setLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState(null);

  const fetchLocation = async () => {
    try {
      const status = await requestLocationPermission();
      if (status !== 'granted') {
        setPermissionGranted(false);
        setError('Permesso negato');
        return;
      }

      setPermissionGranted(true);
      const position = await getCurrentPosition();
      setLocation(position.coords);
    } catch (err) {
      setError('Errore nella posizione');
    }
  };

  return { location, permissionGranted, error, fetchLocation };
};

export default useLocationViewModel;
