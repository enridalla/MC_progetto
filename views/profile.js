// /views/Profile.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import useProfileViewModel from '../viewmodels/profileViewModel';

const Profile = () => {
  const { userData, updateUserInfo } = useProfileViewModel();

  return (
    <View>
      <Text>Nome: {userData.name}</Text>
      <Text>Email: {userData.email}</Text>
      <Button title="Modifica Profilo" onPress={() => updateUserInfo({ name: 'Luigi Bianchi' })} />
    </View>
  );
};

export default Profile;
