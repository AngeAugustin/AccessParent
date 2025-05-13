import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import * as SecureStore from 'expo-secure-store';

export default function Profil() {
  const router = useRouter();
  const profileImageUrl = 'https://i.postimg.cc/9FqSnKGz/Accueil.jpg';
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const [user, setUser] = useState({
    NPI: '',
    nomPrenoms: '',
    email: '',
    role: '',
  });

  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await SecureStore.getItemAsync('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser({
            NPI: parsedUser.NPI || '',
            nomPrenoms: `${parsedUser.Firstname} ${parsedUser.Name}` || '',
            email: parsedUser.Email || '',
            role: parsedUser.Role || '',
          });
          fetchUserProfile(parsedUser.NPI);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`https://mediumvioletred-mole-607585.hostingersite.com/AccessBackend/public/api/modif/${user.NPI}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Telephone: telephone,
          Adresse: adresse,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des informations');
      }

      const data = await response.json();
      Alert.alert('Succès', data.message);
    } catch (error) {
      console.error('Erreur API:', error);
      Alert.alert('Erreur', 'Il y a eu un problème lors de la mise à jour de votre profil.');
    }
  };

  const fetchUserProfile = async (NPI: string) => {
    try {
      const response = await fetch(`https://mediumvioletred-mole-607585.hostingersite.com/AccessBackend/public/api/profil_parent/${NPI}`);

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil utilisateur');
      }

      const data = await response.json();
      setTelephone(data.Telephone || '');
      setAdresse(data.Adresse || '');
    } catch (error) {
      console.error('Erreur API:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mon profil</Text>
          <Text style={styles.subtitle}>Gérer mon profil</Text>
        </View>
      </View>

      {/* Avatar statique */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
        </View>

        <Text style={styles.idText}>{user.NPI}</Text>
        <Text style={styles.idText}>{user.nomPrenoms}</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Modifier vos informations</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={user.email}
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Numéro de téléphone"
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Profession"
            value={user.role}
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Adresse"
            value={adresse}
            onChangeText={setAdresse}
          />

          <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
            <Text style={styles.buttonText}>Enregistrer les modifications</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282828',
    fontFamily: 'Montserrat_700Bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#7F7F7F',
    textAlign: 'center',
    fontFamily: 'Montserrat_400Regular',
    marginTop: 5,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#0a4191',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  idText: {
    marginTop: 5,
    fontSize: 12,
    color: '#282828',
    fontWeight: '500',
    fontFamily: 'Montserrat_400Regular',
  },
  form: {
    width: '100%',
    gap: 5,
  },
  formContainer: {
    marginTop: 15,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282828',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Montserrat_700Bold',
  },
  input: {
    height: 40,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#282828',
    marginBottom: 5,
    fontFamily: 'Montserrat_400Regular',
  },
  button: {
    height: 45,
    backgroundColor: '#0a4191',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#F3F1FF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Montserrat_700Bold',
  },
  profileImage: {
    width: 95,
    height: 95,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
  },
});
