import { getSID } from './profileModel';
import { getCurrentPosition } from './locationModel'; 
import dbController from '../models/DBController';

const BASE_URL = 'https://develop.ewlab.di.unimi.it/mc/2425'; 

// Function to fetch the image of a specific menu by its ID
const fetchMenuImage = async (menuId) => {
  try {
    if (!menuId) {
      throw new Error('Invalid menu ID');
    }

    console.log(`[fetchMenuImage] Fetching image for menuId: ${menuId}`);

    // Fetch dal DB prima
    const base64Image = await dbController.getImage(menuId); 
    if (base64Image) {
      console.log(`[fetchMenuImage] Image found in DB for menuId ${menuId}`);
      return base64Image;
    }

    // Fetch dal server se l'immagine non è nel DB
    console.log(`[fetchMenuImage] Image not found in DB for menuId ${menuId}. Fetching from server...`);
    const sid = await getSID();
    const response = await fetch(`${BASE_URL}/menu/${menuId}/image?sid=${sid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sid}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      console.error('[fetchMenuImage] Error fetching image:', data);
      throw new Error(data.error || 'Error fetching image');
    }

    const imageUrl = await response.json();
    const imageBase64 = imageUrl.base64;

    // Salva l'immagine nel DB per future richieste
    await dbController.saveImage(menuId, imageBase64);

    return imageBase64; // Restituisci l'immagine base64 ricevuta dal server

  } catch (error) {
    console.error('[fetchMenuImage] Error during image fetch:', error);
    throw error;
  }
};

// Function to fetch menus based on dynamic latitude and longitude
export const fetchMenus = async () => {
  try {
    const location = await getCurrentPosition();
    console.log('[fetchMenus] Current location:', location);
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    const sid = await getSID();

    if (!latitude || !longitude) {
      throw new Error('Invalid latitude or longitude');
    }

    const response = await fetch(`${BASE_URL}/menu?lat=${latitude}&lng=${longitude}&sid=${sid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      console.log('[fetchMenus] Error fetching menus:', data);
      throw new Error(data.error || 'Error fetching menus');
    }

    const menus = await response.json();

    // Fetch images for each menu and add other details
    const updatedMenus = await Promise.all(menus.map(async (menu) => {
      const menuId = menu.mid;
      let menuImage = null;

      if (menuId) {
        try {
          menuImage = await fetchMenuImage(menuId);
        } catch (error) {
          console.log(`[fetchMenus] Failed to fetch image for menuId ${menuId}:`, error);
        }
      }

      return {
        ...menu,
        image: menuImage || 'default-image-url', // Use a default image or null if no image fetched
        location: {
          lat: latitude,
          lng: longitude,
        },
      };
    }));

    return updatedMenus;

  } catch (error) {
    console.log('[fetchMenus] Error during menu fetch or image fetch:', error);
    throw error; // Re-throw to be handled by the calling function
  }
};

// Function to fetch details of a specific menu (with image)
export const fetchMenuDetails = async (menuId) => {
  try {
    if (!menuId) {
      throw new Error('Menu ID non valido');
    }

    const sid = await getSID();

    console.log(`[fetchMenuDetails] Fetching details for menuId: ${menuId}`);

    // Get the real latitude and longitude from the user's position
    const location = await getCurrentPosition();
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    // Fetch the menu details
    const response = await fetch(`${BASE_URL}/menu/${menuId}?lat=${latitude}&lng=${longitude}&sid=${sid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      console.log('[fetchMenuDetails] Errore durante il fetch dei dettagli:', data);
      throw new Error(data.error || 'Errore durante il fetch dei dettagli del menu');
    }

    // Parse the response data
    const menuDetails = await response.json();

    // Fetch the menu image
    let menuImage = null;
    try {
      menuImage = await fetchMenuImage(menuId); // Fetch image for the menu
    } catch (error) {
      console.log(`[fetchMenuDetails] Failed to fetch image for menuId ${menuId}:`, error);
    }

    // Add the image to the menu details
    const updatedMenuDetails = {
      ...menuDetails,
      image: menuImage || 'default-image-url', // Use a default image if no image is fetched
    };

    return updatedMenuDetails;
  } catch (error) {
    console.log('[fetchMenuDetails] Errore durante il fetch dei dettagli del menu:', error);
    throw error; // Re-throw to be handled by the calling function
  }
};
