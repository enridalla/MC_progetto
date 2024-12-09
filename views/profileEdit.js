import React from 'react';
import { SafeAreaView, Text, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
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
      <View style={styles.container}>
        <Text style={styles.title}>Modifica Profilo</Text>

        {/* Nome */}
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          value={formData.firstName}
          onChangeText={(text) => updateField('firstName', text)}
        />

        {/* Cognome */}
        <Text style={styles.label}>Cognome:</Text>
        <TextInput
          style={styles.input}
          value={formData.lastName}
          onChangeText={(text) => updateField('lastName', text)}
        />

        {/* Numero della Carta */}
        <Text style={styles.label}>Numero della Carta:</Text>
        <TextInput
          style={styles.input}
          value={formData.cardNumber}
          onChangeText={(text) => updateField('cardNumber', text)}
          keyboardType="numeric"
        />

        {/* Mese di Scadenza */}
        <Text style={styles.label}>Mese di Scadenza:</Text>
        <TextInput
          style={styles.input}
          value={formData.cardExpireMonth}
          onChangeText={(text) => updateField('cardExpireMonth', text)}
          keyboardType="numeric"
        />

        {/* Anno di Scadenza */}
        <Text style={styles.label}>Anno di Scadenza:</Text>
        <TextInput
          style={styles.input}
          value={formData.cardExpireYear}
          onChangeText={(text) => updateField('cardExpireYear', text)}
          keyboardType="numeric"
        />

        {/* CVV */}
        <Text style={styles.label}>CVV:</Text>
        <TextInput
          style={styles.input}
          value={formData.cardCVV}
          onChangeText={(text) => updateField('cardCVV', text)}
          keyboardType="numeric"
        />

        {/* Bottoni per salvare e annullare */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Salva</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Indietro</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '48%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileEditScreen;
