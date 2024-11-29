// /viewmodels/profileViewModel.js
import { useState } from 'react';

const useProfileViewModel = () => {
  const [userData, setUserData] = useState({
    name: 'Mario Rossi',
    email: 'mario@example.com',
  });

  const updateUserInfo = (newData) => {
    setUserData({ ...userData, ...newData });
  };

  return {
    userData,
    updateUserInfo,
  };
};

export default useProfileViewModel;
