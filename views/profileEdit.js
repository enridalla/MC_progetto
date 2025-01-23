import React from 'react';
import { SafeAreaView, Text, View, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Title } from 'react-native-paper';
import useProfileViewModel from '../viewmodels/profileViewModel';

const ProfileEditScreen = ({ navigation }) => {
  const { formData, updateFormData, updateUserData, loading, error } = useProfileViewModel();

  const handleSave = async () => {
    const success = await updateUserData();
    if (success) {
      navigation.goBack();
    } else {
      Alert.alert('Errore', 'Si è verificato un errore durante il salvataggio dei dati');
    }
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informazioni personali</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome:</Text>
            <TextInput
              style={styles.input}
              placeholder="Inserisci il tuo nome"
              value={formData.firstName}
              onChangeText={(text) => updateFormData('firstName', text)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cognome:</Text>
            <TextInput
              style={styles.input}
              placeholder="Inserisci il tuo cognome"
              value={formData.lastName}
              onChangeText={(text) => updateFormData('lastName', text)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dati carta di pagamento</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Numero della Carta:</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChangeText={(text) => updateFormData('cardNumber', text)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.rowItem]}>
              <Text style={styles.label}>Mese di Scadenza:</Text>
              <TextInput
                style={styles.input}
                placeholder="MM"
                value={formData.cardExpireMonth.toString()}
                onChangeText={(text) => updateFormData('cardExpireMonth', text)}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>

            <View style={[styles.inputGroup, styles.rowItem]}>
              <Text style={styles.label}>Anno di Scadenza:</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY"
                value={formData.cardExpireYear.toString()}
                onChangeText={(text) => updateFormData('cardExpireYear', text)}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CVV:</Text>
            <TextInput
              style={styles.input}
              placeholder="XXX"
              value={formData.cardCVV}
              onChangeText={(text) => updateFormData('cardCVV', text)}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
        </View>

        <View>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContainer: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 4, color: '#555' },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: { marginTop: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowItem: { flex: 1, marginRight: 8 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18 },
  error: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: 'red' },
});

export default ProfileEditScreen;
