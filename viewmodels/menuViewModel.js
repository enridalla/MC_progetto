// /viewmodels/menuViewModel.js
import { useState, useEffect } from 'react';
import { fetchMenus } from '../models/menuModel';

const useMenuViewModel = () => {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const loadedMenus = fetchMenus(); // Carica i menù dal model
    setMenus(loadedMenus);
  }, []);

  return { menus };
};

export default useMenuViewModel;
