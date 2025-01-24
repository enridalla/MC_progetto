import { useState, useEffect } from 'react';
import { fetchMenuDetails, fetchMenus } from '../models/menuModel';

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
        const data = await fetchMenus();
        setMenus(data);
      } catch (err) {
        setError(err.message || 'Errore durante il caricamento dei menù');
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
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
  

  return { menus, menuDetails, loading, error };
};

export default useMenuViewModel;
