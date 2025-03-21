import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import * as ImagePicker from 'expo-image-picker'; 
import * as SecureStore from 'expo-secure-store'; 

export default function Profil() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  // State pour stocker les informations de l'utilisateur
  const [user, setUser] = useState({
    NPI: '',
    nomPrenoms: '',
    email: '',
    role: '', 
  });

  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');

  useEffect(() => {
    // Fonction pour récupérer les données utilisateur depuis SecureStore
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

          // Une fois le NPI récupéré, appeler l'API pour obtenir le téléphone et l'adresse
          fetchUserProfile(parsedUser.NPI);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur', error);
      }
    };

    fetchUserData();
  }, []);

  // Fonction pour envoyer les modifications au backend
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`https://access-backend-a961a1f4abb2.herokuapp.com/api/modif/${user.NPI}`, {
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

  // Fonction pour récupérer le profil utilisateur depuis l'API
  const fetchUserProfile = async (NPI: string) => {
    try {
      const response = await fetch(`https://access-backend-a961a1f4abb2.herokuapp.com/api/profil/${NPI}`); 

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

  // Fonction pour sélectionner une image depuis la galerie
  const handleImageUpload = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission requise", "Vous devez autoriser l'accès à la galerie pour choisir une image.");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // Vérifier que l'utilisateur n'a pas annulé et qu'il y a des assets
    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      setAvatarUri(pickerResult.assets[0].uri);
    }
  };

  // Fonction pour supprimer l'image
  const handleRemoveImage = () => {
    setAvatarUri(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mon profil</Text>
          <Text style={styles.subtitle}>Gérer mon profil</Text>
        </View>
      </View> 

      {/* Avatar et upload image */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={handleImageUpload} style={styles.avatarWrapper}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <Icon name="camera-alt" size={40} color="#0a4191" />
          )}

          {/* Icône de suppression dans le coin supérieur droit */}
          {avatarUri && (
            <TouchableOpacity onPress={handleRemoveImage} style={styles.deleteButton}>
              <Icon name="delete" size={24} color="orange" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* Affichage du NPI, Nom Prénoms et Email */}
        <Text style={styles.idText}>{user.NPI}</Text>
        <Text style={styles.idText}>{user.nomPrenoms}</Text>

      </View>

      {/* Formulaire */}
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
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 15,
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
});
