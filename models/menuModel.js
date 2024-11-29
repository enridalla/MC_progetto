// /models/menuModel.js
import * as Location from 'expo-location';

const BASE_URL = 'https://develop.ewlab.di.unimi.it/mc/2425'; // Base URL for your API
const sid = 'vC51NLdQlBnA4no63Ah4YGsiZn0w1MqXvqVRcyxx5lc2nQtYZSTnsVaq9d3EsklJ'; // Your session ID (replace with your own)

export const fetchMenus = async () => {
  try {
    // Request permission to access the user's location
    const permissionResponse = await Location.requestForegroundPermissionsAsync();

    if (permissionResponse.status !== 'granted') {
      throw new Error('Location permission not granted');
    }

    // Get the current position of the user
    const { coords } = await Location.getCurrentPositionAsync();
    console.log('[fetchMenus] Current position:', coords);

    const { latitude, longitude } = coords;
    if (!latitude || !longitude) {
      throw new Error('Invalid location data');
    }

    // Fetch the menus based on latitude and longitude from the API
    const response = await fetch(`${BASE_URL}/menu?lat=${latitude}&lng=${longitude}&sid=${sid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      console.error('[fetchMenus] Error in response:', data);
      throw new Error(data.error || 'Error fetching menus');
    }

    const data = await response.json();
    console.log('[fetchMenus] Menus data received:', data);

    // Returning the menus data along with location
    return { menus: data, location: { latitude, longitude } };

  } catch (error) {
    console.error('[fetchMenus] Error during menu fetch or location:', error);
    throw error; // Re-throw to be handled by the calling function
  }
};
