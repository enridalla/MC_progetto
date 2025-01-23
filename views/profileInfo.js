import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Card, Title, Button, Paragraph, Avatar } from 'react-native-paper';
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
      {/* Icona grande del profilo */}
      <View style={styles.avatarContainer}>
        <Avatar.Icon size={120} icon="account" style={styles.avatar} />
      </View>

      {/* Dati Utente */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Dati Utente</Title>
          <View style={styles.dataRow}>
            <Paragraph style={styles.label}>Nome:</Paragraph>
            <Paragraph style={styles.value}>{userData.firstName}</Paragraph>
          </View>
          <View style={styles.dataRow}>
            <Paragraph style={styles.label}>Cognome:</Paragraph>
            <Paragraph style={styles.value}>{userData.lastName}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      {/* Dati Carta di Credito */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Carta di Credito</Title>
          <View style={styles.dataRow}>
            <Paragraph style={styles.label}>Intestatario:</Paragraph>
            <Paragraph style={styles.value}>{userData.cardFullName}</Paragraph>
          </View>
          <View style={styles.dataRow}>
            <Paragraph style={styles.label}>Numero:</Paragraph>
            <Paragraph style={styles.value}>{userData.cardNumber}</Paragraph>
          </View>
          <View style={styles.dataRow}>
            <Paragraph style={styles.label}>Scadenza:</Paragraph>
            <Paragraph style={styles.value}>
              {userData.cardExpireMonth}/{userData.cardExpireYear}
            </Paragraph>
          </View>
          <View style={styles.dataRow}>
            <Paragraph style={styles.label}>CVV:</Paragraph>
            <Paragraph style={styles.value}>{userData.cardCVV}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      {/* Pulsante per Modificare il Profilo */}
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
  container: { padding: 16, backgroundColor: '#f5f5f5' },
  avatarContainer: { justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  avatar: { backgroundColor: '#6554a4' },
  card: { marginVertical: 12, borderRadius: 8, elevation: 2, backgroundColor: '#fff' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 16, color: '#555' },
  value: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  button: { marginTop: 24 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { fontSize: 18 },
  error: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  errorText: { fontSize: 18, color: 'red' },
});

export default ProfileInfoScreen;
