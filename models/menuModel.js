import * as Location from 'expo-location';

const BASE_URL = 'https://develop.ewlab.di.unimi.it/mc/2425'; // Base URL for your API
const sid = 'vC51NLdQlBnA4no63Ah4YGsiZn0w1MqXvqVRcyxx5lc2nQtYZSTnsVaq9d3EsklJ'; // Your session ID (replace with your own)

// Hardcoded latitude and longitude for the location
const HARD_CODED_LATITUDE = 45.4642; // Example: Latitude for Milan
const HARD_CODED_LONGITUDE = 9.1900; // Example: Longitude for Milan

// Function to fetch the image of a specific menu by its ID
const fetchMenuImage = async (menuId) => {
  try {
    if (!menuId) {
      throw new Error('Invalid menu ID');
    }

    console.log(`[fetchMenuImage] Fetching image for menuId: ${menuId}`);

    const response = await fetch(`${BASE_URL}/menu/${menuId}/image?sid=${sid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${sid}`
      },
    });

    console.log(`[fetchMenuImage] Response status for menuId ${menuId}: ${response.status}`);

    if (!response.ok) {
      const data = await response.json();
      console.error('[fetchMenuImage] Error fetching image:', data);
      throw new Error(data.error || 'Error fetching image');
    }

    const imageUrl = await response.json();
    console.log(`[fetchMenuImage] Image URL received for menuId ${menuId}: ${imageUrl.image}`);

    return imageUrl.image; // Assuming the response contains the image URL under the "image" field (base64)

  } catch (error) {
    console.error('[fetchMenuImage] Error during image fetch:', error);
    throw error; // Re-throw to be handled by the calling function
  }
};

// Function to fetch menus based on hardcoded latitude and longitude
export const fetchMenus = async () => {
  try {
    // Use the hardcoded latitude and longitude
    const latitude = HARD_CODED_LATITUDE;
    const longitude = HARD_CODED_LONGITUDE;

    console.log(`[fetchMenus] Fetching menus for latitude: ${latitude}, longitude: ${longitude}`);

    if (!latitude || !longitude) {
      throw new Error('Invalid latitude or longitude');
    }

    // Fetch the menus based on hardcoded latitude and longitude from the API
    console.log(`[fetchMenus] Making request to: ${BASE_URL}/menu?lat=${latitude}&lng=${longitude}&sid=${sid}`);
    const response = await fetch(`${BASE_URL}/menu?lat=${latitude}&lng=${longitude}&sid=${sid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`[fetchMenus] Response status for menus: ${response.status}`);

    if (!response.ok) {
      const data = await response.json();
      console.error('[fetchMenus] Error fetching menus:', data);
      throw new Error(data.error || 'Error fetching menus');
    }

    const menus = await response.json();
    console.log('[fetchMenus] Menus data received:', menus);

    // For each menu, fetch the image URL and add other details
    const updatedMenus = await Promise.all(menus.map(async (menu) => {
      const menuId = menu.mid; // Ensure we are accessing the "mid" correctly
      console.log(`[fetchMenus] Fetching image for menuId: ${menuId}`);

      let menuImage = null;

      if (menuId) {
        try {
          menuImage = await fetchMenuImage(menuId); // Fetch image for the menu
        } catch (error) {
          console.error(`[fetchMenus] Failed to fetch image for menuId ${menuId}:`, error);
        }
      }

      // Return the updated menu with image and location data
      return {
        ...menu,
        image: menuImage || 'default-image-url', // Use a default image or null if no image fetched
        location: {
          lat: HARD_CODED_LATITUDE,
          lng: HARD_CODED_LONGITUDE,
        },
      };
    }));

    // Returning the menus data with images and hardcoded location
    console.log('[fetchMenus] Updated menus with images:', updatedMenus);
    return updatedMenus;

  } catch (error) {
    console.error('[fetchMenus] Error during menu fetch or image fetch:', error);
    throw error; // Re-throw to be handled by the calling function
  }
};
