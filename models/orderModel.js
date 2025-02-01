import { getSID, getUID } from './profileModel';
import { getCurrentPosition } from './locationModel'; 

const BASE_URL = 'https://develop.ewlab.di.unimi.it/mc/2425'; 

export const getOrderStatus = async () => {
    const sid = await getSID();
    const uid = await getUID();
    const response = await fetch(`${BASE_URL}/order/${uid}?oid=${uid}&sid=${sid}`, {
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
            console.log('[buyMenu] Error buying menu:', data);
            throw new Error(data.error || 'Error buying menu: ' + response.status);
        } 

        console.log('Menu bought: ', menuId);
    } catch (error) {
        console.log('[buyMenu] Error during menu buy:', error);
        throw error;
    }
}