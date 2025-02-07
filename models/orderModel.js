import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSID } from './profileModel';
import { getCurrentPosition } from './locationModel'; 


const BASE_URL = 'https://develop.ewlab.di.unimi.it/mc/2425'; 
let lastOrder = null;

export const getOID = async () => {
  try {
    const oid = await AsyncStorage.getItem('oid');
    if (oid !== null) {
      console.log('[getOID] Retrieved OID:', oid);
    } else {
      console.log('[getOID] No OID found in storage.');
    }
    return oid;
  } catch (error) {
    console.error('[getOID] Error retrieving OID:', error);
    return null;
  }
};

export const setOID = async (oid) => {
  try {
    if (!oid) {
      throw new Error('Invalid OID: cannot be null or undefined.');
    }
    await AsyncStorage.setItem('oid', oid);
    console.log('[setOID] OID successfully saved:', oid);
  } catch (error) {
    console.error('[setOID] Error saving OID:', error);
  }
};

export const getOrderStatus = async () => {
    const sid = await getSID();
    const oid = await getOID();
    const response = await fetch(`${BASE_URL}/order/${oid}?oid=${oid}&sid=${sid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

    if (!response.ok) {
        const data = await response.json();
        console.error('[getOrderStatus] Error fetching order status:', data);
        throw new Error(data.error || 'Error fetching order status');
    } 

    const data = await response.json();
    console.log('Order status:', data);
    return data;
};

export const buyMenu = async (menuId) => {
  try {
    const sid = await getSID();
    const location = await getCurrentPosition();

    console.log('buyMenu', menuId, sid, location);
    const response = await fetch(`${BASE_URL}/menu/${menuId}/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sid: sid,
        deliveryLocation: {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        },
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      console.log('[buyMenu] Error during menu purchase:', data);
      if (data.message == "User already has an active order") {
        return { success: false, message: 'Hai già un ordine attivo. Attendi l\'ordine corrente prima di acquistare un nuovo menù.' };
      }
      return { success: false, message: data.message || 'Errore durante l\'acquisto del menù' };
    }
  
    const data = await response.json();
    await setOID(data.oid.toString());

    return { success: true, message: 'Menù acquistato con successo' };
  } catch (error) {
    console.error('[buyMenu] Error during menu purchase:', error);
    return { success: false, message: 'Errore durante l\'acquisto del menù. Riprova più tardi.' };
  }
};

export const getLastOrder = async () => {
  if (lastOrder) {
    return lastOrder;
  }

  try {
    order = await AsyncStorage.getItem('lastOrder');
    if(order) {
      console.log('[getLastOrder] Retrieved last order');
      lastOrder = JSON.parse(order);
      return lastOrder;
    } else {
      console.log('[getLastOrder] No last order found in storage.');
      return
    }
  } catch (error) {
    console.log('[getLastOrder] Error retrieving last order:', error);
  }
};

export const saveLastOrder = async (order) => {
  try {
    if (!order) {
      throw new Error('Invalid order: cannot be null or undefined.');
    }
    await AsyncStorage.setItem('lastOrder', JSON.stringify(order));
    lastOrder = order;
    console.log('[setLastOrder] Last order successfully saved');
  } catch (error) {
    console.log('[setLastOrder] Error saving last order:', error);
  }
};