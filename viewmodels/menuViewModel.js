// /viewmodels/menuViewModel.js
import { useState, useEffect } from 'react';
import { fetchMenus } from '../models/menuModel';

const useMenuViewModel = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true); // Per gestire lo stato di caricamento

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const loadedMenus = await fetchMenus(); // Carica i menù dal model (asincrono)
        setMenus(loadedMenus);
      } catch (error) {
        console.error('Errore nel caricamento dei menù:', error);
      } finally {
        setLoading(false); // Finito il caricamento
      }
    };

    loadMenus();
  }, []); // L'effetto viene eseguito solo al primo rendering del componente

  return { menus, loading };
};

export default useMenuViewModel;
