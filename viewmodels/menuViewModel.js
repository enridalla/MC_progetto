// /viewmodels/menuViewModel.js
import { useState, useEffect } from 'react';
import { fetchMenus } from '../models/menuModel';

const useMenuViewModel = () => {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const loadedMenus = await fetchMenus(); 
        setMenus(loadedMenus);
      } catch (error) {
        console.error('Errore nel caricamento dei menù:', error);
      }
    })();
  }, []);

  const handleMenuSelect = (menu) => {
    console.log(`Menu selezionato: ${menu.name}`);
  };

  return { menus, handleMenuSelect };
};

export default useMenuViewModel;
