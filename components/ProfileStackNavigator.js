import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileInfo from '../views/profileInfo';
import ProfileEdit from '../views/profileEdit';

const ProfileStack = createNativeStackNavigator();

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator detachInactiveScreens={false}>
    <ProfileStack.Screen name="ProfileInfo" component={ProfileInfo} options={{ title: 'Profilo' }} />
    <ProfileStack.Screen name="ProfileEdit" component={ProfileEdit} options={{ title: 'Modifica Profilo' }} />
  </ProfileStack.Navigator>
);

export default ProfileStackNavigator;
