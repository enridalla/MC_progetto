import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Card, Title, Button } from 'react-native-paper';
import useProfileViewModel from '../viewmodels/profileViewModel';

const ProfileInfoScreen = ({ navigation }) => {
  const { userData, loading, error } = useProfileViewModel();

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Caricamento in corso...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>Errore: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.subtitle}>Dati Utente</Title>
          <Card style={styles.subcard}>
            <Card.Content>
              <Title style={styles.text}>Nome: {userData.firstName}</Title>
            </Card.Content>
          </Card>
          <Card style={styles.subcard}>
            <Card.Content>
              <Title style={styles.text}>Cognome: {userData.lastName}</Title>
            </Card.Content>
          </Card>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.subtitle}>Carta di Credito</Title>
          <Card style={styles.subcard}>
            <Card.Content>
              <Title style={styles.text}>Intestatario: {userData.cardFullName}</Title>
            </Card.Content>
          </Card>
          <Card style={styles.subcard}>
            <Card.Content>
              <Title style={styles.text}>Numero: {userData.cardNumber}</Title>
            </Card.Content>
          </Card>
          <Card style={styles.subcard}>
            <Card.Content>
              <Title style={styles.text}>Scadenza: {userData.cardExpireMonth}/{userData.cardExpireYear}</Title>
            </Card.Content>
          </Card>
          <Card style={styles.subcard}>
            <Card.Content>
              <Title style={styles.text}>CVV: {userData.cardCVV}</Title>
            </Card.Content>
          </Card>
        </Card.Content>
      </Card>

      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('ProfileEdit')} 
        style={styles.button}
      >
        Modifica Profilo
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, textAlign: 'center' },
  card: { marginVertical: 8 },
  subcard: { marginVertical: 4 },
  button: { marginTop: 16 },
  subtitle: { fontSize: 20, fontWeight: 'bold' },
  text: { fontSize: 16 },
});

export default ProfileInfoScreen;