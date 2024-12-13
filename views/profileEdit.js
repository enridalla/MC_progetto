import React from 'react';
import { SafeAreaView, Text, View, TextInput, StyleSheet } from 'react-native';
import { Button, Title } from 'react-native-paper';
import useProfileViewModel from '../viewmodels/profileViewModel';

const ProfileEditScreen = ({ navigation }) => {
  const { formData, updateField, saveChanges, loading, error } = useProfileViewModel();

  const handleSave = () => {
    saveChanges();
    navigation.goBack();
  };

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
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome:</Text>
          <TextInput
            style={styles.input}
            value={formData.firstName}
            onChangeText={(text) => updateField('firstName', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cognome:</Text>
          <TextInput
            style={styles.input}
            value={formData.lastName}
            onChangeText={(text) => updateField('lastName', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Numero della Carta:</Text>
          <TextInput
            style={styles.input}
            value={formData.cardNumber}
            onChangeText={(text) => updateField('cardNumber', text)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mese di Scadenza:</Text>
          <TextInput
            style={styles.input}
            value={formData.cardExpireMonth.toString().padStart(2, '0')} // Assicurati che il mese sia un numero a due cifre
            onChangeText={(text) => updateField('cardExpireMonth', text.padStart(2, '0'))} // Mantieni sempre due cifre
            keyboardType="numeric"
            maxLength={2}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Anno di Scadenza:</Text>
          <TextInput
            style={styles.input}
            value={formData.cardExpireYear.toString()} // Mantieni l'anno come numero
            onChangeText={(text) => updateField('cardExpireYear', text)} // Anno come stringa per facilitare l'input
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>CVV:</Text>
          <TextInput
            style={styles.input}
            value={formData.cardCVV}
            onChangeText={(text) => updateField('cardCVV', text)}
            keyboardType="numeric"
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
        >
          Salva
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Indietro
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' }, 
  innerContainer: { flex: 1, marginHorizontal: 16, marginVertical: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 4, paddingLeft: 8, color: '#333' }, 
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingLeft: 10, fontSize: 16, backgroundColor: '#fff'},
  button: { marginTop: 16, marginHorizontal: 16 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18 },
  error: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: 'red' },
});

export default ProfileEditScreen;
