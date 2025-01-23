const BASE_URL = 'https://develop.ewlab.di.unimi.it/mc/2425';
const SID = '0EVb5bQModsCTtHFOWPzuZHelLAIcKA1cVGs411iHvbnKg90HU0cRxQoa6U9GkCd';

export const createUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}/sid`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok){
      console.log(`Response not OK, status: ${response.status}`);
      const data = await response.json();
      throw new Error(data.error || `Failed to fetch SID, status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching SID:', error);
    throw error;
}
};

export const getUserData = async (uid) => {
  uid = 36228; // ID utente DA TOGLIERE
    try {
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
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  export const saveUserData = async (uid, data) => {
     uid = 36228; // ID utente DA TOGLIERE

    try {
      const updatedData = {
        ...data,
        sid: SID, 
      };
    
      console.log('Data to save:', updatedData);
      const response = await fetch(`${BASE_URL}/user/${uid}?sid=${SID}`, {
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