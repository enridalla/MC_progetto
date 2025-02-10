import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Card, Title, Button, Paragraph, Avatar } from 'react-native-paper';
import useProfileViewModel from '../viewmodels/profileViewModel';
import { useFocusEffect } from '@react-navigation/native';
import LoadingIndicator from './loading';

const ProfileInfoScreen = ({ navigation }) => {
  const { userData, lastOrder, loading, error, refreshProfileData } = useProfileViewModel();

  useFocusEffect(
    useCallback(() => {
      refreshProfileData(); // chiama la funzione del viewmodel per ricaricare i dati
    }, [])
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>Errore: {error}</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.incompleteProfileContainer}>
        <Avatar.Icon size={120} icon="account-alert" style={styles.incompleteAvatar} />
        <Text style={styles.incompleteText}>
          Completa il tuo profilo ed inizia ad ordinare!
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('ProfileEdit')}
          style={styles.incompleteButton}
        >
          Completa il profilo
        </Button>
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
            <Paragraph style={styles.value}>{userData.firstName || ""}</Paragraph>
          </View>
          <View style={styles.dataRow}>
            <Paragraph style={styles.label}>Cognome:</Paragraph>
            <Paragraph style={styles.value}>{userData.lastName || ""}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      {/* Dati Carta di Credito */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Carta di Credito</Title>
          <View style={styles.dataRow}>
            <Paragraph style={styles.label}>Intestatario:</Paragraph>
            <Paragraph style={styles.value}>{userData.cardFullName || ""}</Paragraph>
          </View>
          <View style={styles.dataRow}>
            <Paragraph style={styles.label}>Numero:</Paragraph>
            <Paragraph style={styles.value}>{userData.cardNumber || ""}</Paragraph>
          </View>
          <View style={styles.dataRow}>
            <Paragraph style={styles.label}>Scadenza:</Paragraph>
            <Paragraph style={styles.value}>
              {(userData.cardExpireMonth && userData.cardExpireYear) ? `${userData.cardExpireMonth}/${userData.cardExpireYear}` : ""}
            </Paragraph>
          </View>
          <View style={styles.dataRow}>
            <Paragraph style={styles.label}>CVV:</Paragraph>
            <Paragraph style={styles.value}>{userData.cardCVV || ""}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      {/* Dati ultimo ordine */}
      {lastOrder ? (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Ultimo ordine:</Title>
            <View style={styles.dataRow}>
              <Paragraph style={styles.label}>Nome:</Paragraph>
              <Paragraph style={styles.value}>{lastOrder.name || ""}</Paragraph>
            </View>
            <View style={styles.dataRow}>
              <Paragraph style={styles.label}>Prezzo:</Paragraph>
              <Paragraph style={styles.value}>{lastOrder.price || ""}€</Paragraph>
            </View>
          </Card.Content>
        </Card>
      ) : (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Ultimo ordine:</Title>
            <Paragraph style={styles.label}>Nessun ordine effettuato</Paragraph>
          </Card.Content>
        </Card>
      )}

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
  incompleteProfileContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#f5f5f5'},
  incompleteAvatar: { backgroundColor: '#ff7043', marginBottom: 16},
  incompleteText: { fontSize: 18, textAlign: 'center', marginBottom: 16, color: '#333'},
  incompleteButton: { marginTop: 16},
});

export default ProfileInfoScreen;
