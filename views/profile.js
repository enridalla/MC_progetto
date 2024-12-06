import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, ScrollView, View, TextInput, StatusBar, TouchableOpacity } from 'react-native';
import { Card, Button, Title } from 'react-native-paper'; // Usando react-native-paper
import useProfileViewModel from '../viewmodels/profileViewModel';

const Profile = () => {
  const { userData, updateUserInfo } = useProfileViewModel();
  const [page, setPage] = useState(false); // Definizione di page e setPage

  // Gestore per il salvataggio dei dati modificati
  const handleSubmit = () => {
    // Qui puoi aggiungere la logica per aggiornare i dati
    updateUserInfo({
      nome: firstName,
      cognome: lastName,
      numero: cardNumber,
      scadenza: `${expiryMonth}/${expiryYear}`,
      cvv,
    });
    setPage(false); // Tornare alla vista del profilo dopo aver salvato
  };

  // Stato per i dati modificabili
  const [firstName, setFirstName] = useState(userData.nome);
  const [lastName, setLastName] = useState(userData.cognome);
  const [cardNumber, setCardNumber] = useState(userData.numero);
  const [expiryMonth, setExpiryMonth] = useState(userData.scadenza.split('/')[0]);
  const [expiryYear, setExpiryYear] = useState(userData.scadenza.split('/')[1]);
  const [cvv, setCvv] = useState(userData.cvv);

  // Ritorna la vista di modifica o di visualizzazione in base al valore di `page`
  if (page) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.title}>Modifica Profilo</Text>

          <Text style={styles.label}>Nome:</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />

          <Text style={styles.label}>Cognome:</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />

          <Text style={styles.label}>Numero della Carta:</Text>
          <TextInput
            style={styles.input}
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Mese di Scadenza:</Text>
          <TextInput
            style={styles.input}
            value={expiryMonth}
            onChangeText={setExpiryMonth}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Anno di Scadenza:</Text>
          <TextInput
            style={styles.input}
            value={expiryYear}
            onChangeText={setExpiryYear}
            keyboardType="numeric"
          />

          <Text style={styles.label}>CVV:</Text>
          <TextInput
            style={styles.input}
            value={cvv}
            onChangeText={setCvv}
            keyboardType="numeric"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Salva</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setPage(false)}>
              <Text style={styles.buttonText}>Indietro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Title style={styles.title}>Profilo</Title>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.subtitle}>Dati Utente</Text>
              <Card style={styles.subcard}>
                <Card.Content>
                  <Text style={styles.text}>Nome: {userData.nome}</Text>
                </Card.Content>
              </Card>
              <Card style={styles.subcard}>
                <Card.Content>
                  <Text style={styles.text}>Cognome: {userData.cognome}</Text>
                </Card.Content>
              </Card>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.subtitle}>Carta di Credito</Text>
              <Card style={styles.subcard}>
                <Card.Content>
                  <Text style={styles.text}>Intestatario: {userData.intestatario}</Text>
                </Card.Content>
              </Card>
              <Card style={styles.subcard}>
                <Card.Content>
                  <Text style={styles.text}>Numero: {userData.numero}</Text>
                </Card.Content>
              </Card>
              <Card style={styles.subcard}>
                <Card.Content>
                  <Text style={styles.text}>Scadenza: {userData.scadenza}</Text>
                </Card.Content>
              </Card>
              <Card style={styles.subcard}>
                <Card.Content>
                  <Text style={styles.text}>CVV: {userData.cvv}</Text>
                </Card.Content>
              </Card>
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            onPress={() => setPage(true)} // Cambia il valore di `page` per passare alla modifica
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Modifica Profilo
          </Button>
        </ScrollView>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 16 + StatusBar.currentHeight, // Spazio per la barra di stato
    paddingBottom: 30,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
    paddingTop: StatusBar.currentHeight,
  },
  card: {
    width: '100%',
    marginBottom: 24,
    borderRadius: 8,
    elevation: 3,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  subcard: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 1,
    backgroundColor: '#fff',
    padding: 12,
  },
  subtitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#444',
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
    color: '#555',
  },
  button: {
    marginTop: 24,
    borderRadius: 8,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
});

export default Profile;
