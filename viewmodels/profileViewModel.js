import { useState, useEffect } from 'react';
import { getUserData, saveUserData } from '../models/profileModel'; 

const useProfileViewModel = (uid) => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      console.log('Loading user data...');
      try {
        setLoading(true);
        const data = await getUserData(uid);
        setUserData(data); // Imposta i dati utente
        setFormData(data);        
      } catch (err) {
        console.error('Error loading user data:', err.message);
        setError(err.message || 'Errore durante il caricamento dei dati');
      } finally {
        setLoading(false);
      }
    };

    loadUserData()
  }, []);

  useEffect(() => {
    console.log('User data changed');
  }, [userData]);  

  // Metodo per aggiornare i campi del form
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Metodo per salvare le modifiche ai dati dell'utente
  const saveChanges = async () => {
    const uid = 36228; 

    try {
      const updatedUserData = {
        ...formData,
        cardFullName: `${formData.firstName} ${formData.lastName}`,
        cardExpireMonth: parseInt(formData.cardExpireMonth, 10),
        cardExpireYear: parseInt(formData.cardExpireYear, 10),
      };

      console.log('Data to save:', userData);

      await saveUserData(uid, updatedUserData);

      setUserData(updatedUserData);   
      
      console.log(userData.firstName, formData.firstName);
    } catch (error) {
      console.error('Error saving user data:', error.message);
      setError(error.message || 'Errore durante il salvataggio dei dati');
    }
  };

  return {
    userData,
    formData,
    loading,
    error,
    updateField,
    saveChanges,
  };
};

export default useProfileViewModel;
