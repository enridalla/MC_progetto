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

  // Metodo per salvare le modifiche ai dati dell'utente
  const updateUserData = async () => {
    try {
      const updatedUserData = {
        ...formData,
        cardFullName: `${formData.firstName} ${formData.lastName}`,
        cardExpireMonth: parseInt(formData.cardExpireMonth, 10),
        cardExpireYear: parseInt(formData.cardExpireYear, 10),
      };

      await saveUserData(updatedUserData);
      setUserData(updatedUserData); 
      
      return true;
    } catch (error) {
      console.error('Error updating user data:', error);
      return false;
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
