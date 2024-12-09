import { useState, useEffect } from 'react';
import { getUserData, saveUserData } from '../models/profileModel'; 

const useProfileViewModel = (uid) => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState(null); // Serve per salvare quando l'utente modifica i dati parzialmente nel form
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const uid = 36228; // ID utente DA TOGLIERE

    if (!uid) {
      console.error('UID is missing. Fetch aborted.');
      return;
    }
  
    const loadUserData = async () => {
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
  
    loadUserData();
  }, [uid]);
  

  // Metodo per aggiornare i campi del form
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Metodo per salvare le modifiche ai dati dell'utente
  const saveChanges = () => {
    const uid = 36228; // ID utente DA TOGLIERE

    const updatedUserData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      cardFullName: `${formData.firstName} ${formData.lastName}`,
      cardNumber: formData.cardNumber,
      cardExpireMonth: parseInt(formData.cardExpireMonth, 10),  // Converti a intero
      cardExpireYear: parseInt(formData.cardExpireYear, 10),    // Converti a intero
      cardCVV: formData.cardCVV,
    };
    saveUserData(uid, updatedUserData);
    console.log('Dati salvati:', updatedUserData);
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
