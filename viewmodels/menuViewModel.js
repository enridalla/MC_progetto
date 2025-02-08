import { useState, useEffect } from 'react';
import { fetchMenuDetails, fetchMenus } from '../models/menuModel';
import dbController from '../models/DBController';
import { buyMenu, saveLastOrder } from '../models/orderModel';
import { getUserData } from '../models/profileModel';

const useMenuViewModel = (menuId = null) => {
  const [menus, setMenus] = useState([]);
  const [menuDetails, setMenuDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (menuId) {
      return;
    }
    const loadMenus = async () => {
      try {
        await dbController.openDB(); 
        const data = await fetchMenus();
        setMenus(data);
      } catch (err) {
        setError(err.message || 'Errore durante il caricamento dei menù');
      } finally {
        setLoading(false);
      }
    };

    loadMenus();

    
    // Funzione di cleanup per chiudere il DB quando il componente viene smontato
    return () => {
      dbController.closeDB(); // Chiama la funzione per chiudere il database
  };
  }, []);

  
  useEffect(() => {
    if (!menuId) {
      setMenuDetails(null);
      return; // Se il menuId non è valido, non fare nulla
    }

    const loadMenuDetails = async () => {
      try {
        setLoading(true);
        const details = await fetchMenuDetails(menuId);
        setMenuDetails(details);
      } catch (err) {
        setError(err.message || 'Errore durante il caricamento dei dettagli');
      } finally {
        setLoading(false);
      }
    };

    loadMenuDetails();
  }, [menuId]);

  const order = async (menuId) => {
    try {
      // Verifica se l'utente ha completato il profilo
      const userData = await getUserData();
      if (!userData) {
        return { success: false, title: 'Profilo incompleto', message: 'Completa il profilo per effettuare un ordine.' };
      }
  
      // Effettua l'ordine
      const orderResponse = await buyMenu(menuId);
      console.log('Order response:', orderResponse);
      if (!orderResponse.success) {
        return { success: false, title: 'Ordine già in corso', message: orderResponse.message || 'Errore nell\'effettuare l\'ordine. Riprova più tardi.' };
      }

      await saveLastOrder(menuDetails);
  
      return { success: true, message: 'Ordine effettuato con successo!' };
    } catch (err) {
      console.error('Errore nell\'effettuare l\'ordine:', err);
      return { success: false, message: 'Si è verificato un errore. Riprova più tardi.' };
    }
  };

  return { menus, menuDetails, loading, error, dbController, order };
};

export default useMenuViewModel;
