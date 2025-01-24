import AsyncStorage from '@react-native-async-storage/async-storage';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
const BASE_URL = 'https://develop.ewlab.di.unimi.it/mc/2425';
let SID = null;
let UID = null;

export const getSID = async () => {
  if (SID) {
    return SID; // Restituisci il SID dalla cache in memoria
  }

  try {
    const sid = await AsyncStorage.getItem('sid');
    if (!sid) {
      console.log('SID non trovato. Devi inizializzare l’utente.');
    }
    SID = sid; 
    return sid;
  } catch (error) {
    console.error('Errore nel recupero del SID:', error);
    throw error;
  }
};

export const getUID = async () => {
  if (UID) {
    return UID; 
  }

  try {
    const uid = await AsyncStorage.getItem('uid');
    if (!uid) {
      console.log('UID non trovato. Devi inizializzare l’utente.');
    }
    UID = uid; 
    return uid;
  } catch (error) {
    console.error('Errore nel recupero del UID:', error);
    throw error;
  }
};

export const fetchSID = async () => {
  try {
    const storedSID = await AsyncStorage.getItem("sid");
    const storedUID = await AsyncStorage.getItem("uid");

    if (storedSID && storedUID) {
      console.log("(profileModel) SID e UID già presenti nello storage.");
      SID = storedSID;
      UID = storedUID;
      return;
    }

    const response = await fetch(`${BASE_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log(`Response not OK, status: ${response.status}`);
      const data = await response.json();
      throw new Error(data.error || `Failed to fetch SID, status: ${response.status}`);
    }

    const data = await response.json();
    
    await AsyncStorage.setItem('sid', data.sid.toString());
    await AsyncStorage.setItem('uid', data.uid.toString());
    SID = data.sid;
    UID = data.uid;

  } catch (error) {
    console.error('Error fetching SID:', error);
    throw error; 
  }
};

export const getUserData = async () => {
  console.log('Fetching user data for ' + UID + " " + SID);

    try {
      const response = await fetch(`${BASE_URL}/user/${UID}?sid=${SID}`, {
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
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  export const saveUserData = async (data) => {
    try {
      const updatedData = {
        ...data,
        sid: SID, 
      };
    
      console.log('Data to save:', updatedData);
      const response = await fetch(`${BASE_URL}/user/${UID}?sid=${SID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',  
        },
        body: JSON.stringify(updatedData), 
      });
    
      if (!response.ok) {
        console.log(`Response not OK, status: ${response.status}`);
        const errorData = await response.text(); 
        throw new Error(errorData || `Failed to save user data, status: ${response.status}`);
    }

      console.log('Data saved successfully');
    } catch (error) {
      console.log('Error saving user data:', error);
      throw error;
    }
};