import { useState, useEffect } from 'react';
import { fetchMenuDetails, fetchMenus } from '../models/menuModel';
import dbController from '../models/DBController';

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
        setLoading(true);
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
      console.log('Closing DB...');
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
  

  return { menus, menuDetails, loading, error, dbController };
};

export default useMenuViewModel;
