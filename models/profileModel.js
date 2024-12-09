// api.js - Modello per la fetch dei dati dell'utente
const BASE_URL = 'https://develop.ewlab.di.unimi.it/mc/2425';
const SID = '0EVb5bQModsCTtHFOWPzuZHelLAIcKA1cVGs411iHvbnKg90HU0cRxQoa6U9GkCd';

export const getUserData = async (uid) => {
    try {
      console.log(`Fetching user data for UID: ${uid}`);
      const response = await fetch(`${BASE_URL}/user/${uid}?sid=${SID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        console.log(`Response not OK, status: ${response.status}`);
        const data = await response.json();
        throw new Error(data.error || `Failed to fetch user data, status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Data fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  export const saveUserData = async (uid, data) => {
    try {
      console.log(`Saving user data for UID: ${uid}`);
      
      // Include SID in the data body if needed
      const updatedData = {
        ...data,
        sid: SID, // Add the SID here to be included in the body
      };
    
      console.log('Data to save:', updatedData);
      const response = await fetch(`${BASE_URL}/user/${uid}?sid=${SID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',  // Corretto come nel test cURL
        },
        body: JSON.stringify(updatedData), // Use updatedData with SID
      });
    
      if (!response.ok) {
        console.log(`Response not OK, status: ${response.status}`);
        const errorData = await response.text(); // Usa .text() per ottenere tutto il corpo
        console.log('Errore dettagliato:', errorData);
        throw new Error(errorData || `Failed to save user data, status: ${response.status}`);
    }

      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
};

  
  
