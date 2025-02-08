import { useState, useEffect } from 'react';
import { getUserData, saveUserData } from '../models/profileModel'; 
import { getLastOrder } from '../models/orderModel';

const useProfileViewModel = (uid) => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUserData = async () => {
    console.log('Loading user data...');
    try {
      const data = await getUserData(uid); 
      setUserData(data);
      if (!formData) {
        setFormData(data || {});
      }       
    } catch (err) {
      console.error('Error loading user data:', err.message);
      setError(err.message || 'Errore durante il caricamento dei dati');
    } finally {
      setLoading(false);
    }
  };

  const loadLastOrder = async () => {
    console.log('Loading last order...');
    try {
      const order = await getLastOrder();
      setLastOrder(order);
    } catch (err) {
      console.error('Error loading last order:', err.message);
      setError(err.message || 'Errore durante il caricamento dell\'ultimo ordine');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {  
    loadUserData();
    loadLastOrder();
  }, []); 

  const refreshProfileData = async () => {
    await loadUserData();
    await loadLastOrder();
  };

  // Metodo per aggiornare i campi del form
  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (formData.firstName && formData.firstName.length > 15 && formData.lastName && formData.lastName.length > 15){
      return { success: false, title: 'Dati non validi', message: 'Il nome e il cognome non possono contenere più di 15 caratteri'};
    }
    if (formData.firstName && formData.firstName.length > 15) {
      return { success: false, title: 'Dati non validi', message: 'Il nome non può contenere più di 15 caratteri'};
    }
    if (formData.lastName && formData.lastName.length > 15) {
      return { success: false, title: 'Dati non validi', message: 'Il cognome non può contenere più di 15 caratteri'};
    }
    if (formData.cardNumber && !/^\d+$/.test(formData.cardNumber)) {
      return { success: false, title: 'Dati non validi', message: 'Il numero della carta deve contenere solo numeri'};
    }
    return { success: true, title: 'Dati non validi', message: 'Dati salvati correttamente'};
  };

  // Metodo per salvare le modifiche ai dati dell'utente
  const updateUserData = async () => {
    try {
      const validate = validateForm();
      if (!validate.success) {
        return validate;
      }

      const updatedUserData = {
        ...formData,
        cardFullName: `${formData.firstName} ${formData.lastName}`,
        cardExpireMonth: parseInt(formData.cardExpireMonth, 10),
        cardExpireYear: parseInt(formData.cardExpireYear, 10),
      };

      await saveUserData(updatedUserData);
      setUserData(updatedUserData); 
      
      return { success: true, message: 'Dati salvati correttamente'};
    } catch (error) {
      console.error('Error updating user data:', error);
      return { success: false, message: 'Errore durante il salvataggio dei dati'};
    }
  };

  return {
    userData,
    formData,
    lastOrder,
    loading,
    error,
    updateFormData,
    updateUserData,
    refreshProfileData,
  };
};

export default useProfileViewModel;
