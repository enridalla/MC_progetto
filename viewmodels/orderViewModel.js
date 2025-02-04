import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://develop.ewlab.di.unimi.it/mc/2425';

export const getOID = async () => {
  try {
    return await AsyncStorage.getItem('oid');
  } catch (error) {
    console.error('[getOID] Error:', error);
    return null;
  }
};

export const setOID = async (oid) => {
  try {
    await AsyncStorage.setItem('oid', oid);
  } catch (error) {
    console.error('[setOID] Error:', error);
  }
};

export const fetchOrderStatus = async (oid, sid) => {
  try {
    const response = await fetch(`${BASE_URL}/order/${oid}?oid=${oid}&sid=${sid}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Errore nel recupero dello stato dell’ordine');
    }

    return await response.json();
  } catch (error) {
    console.error('[fetchOrderStatus] Error:', error);
    throw error;
  }
};

export const fetchBuyMenu = async (menuId, sid, location) => {
  try {
    const response = await fetch(`${BASE_URL}/menu/${menuId}/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sid: sid,
        deliveryLocation: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        },
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Errore durante l’acquisto');
    }

    return await response.json();
  } catch (error) {
    console.error('[fetchBuyMenu] Error:', error);
    throw error;
  }
};
