import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; 

// Définir le type des enfants
interface Enfant {
  NPI_enfant: string;
  Nom_enfant: string;
  Prenom_enfant: string;
}

export default function FinaliserAjout() {
  const router = useRouter();
  const { npi } = useLocalSearchParams();
  const [disponibilites, setDisponibilites] = useState<string[]>([]);

  const [user, setUser] = useState({
    NPI: '',
  });

  const [educateur, setEducateur] = useState({
    NPI: '',
    Name: '',
    Firstname: '',
    Matiere: '',
    Etoiles: 0,
  });

  const [childrenList, setChildrenList] = useState<Enfant[]>([]); // Liste des enfants

  const [selectedChild, setSelectedChild] = useState<string>(''); // L'ID de l'enfant sélectionné
  const [selectedDuree, setSelectedDuree] = useState<string>('');
  const [selectedSeance1, setSelectedSeance1] = useState<string>('');
  const [selectedSeance2, setSelectedSeance2] = useState<string>('');
  const filteredSeance2 = disponibilites.filter(dispo => dispo !== selectedSeance1);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await SecureStore.getItemAsync('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser({
            NPI: parsedUser.NPI || '',
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur', error);
      }
    };

    const fetchEducateurData = async () => {
      try {
        const response = await fetch(`https://access-backend-a961a1f4abb2.herokuapp.com/api/get_educateur/${npi}`);
        const data = await response.json();
        setEducateur({
          NPI: data.NPI,
          Name: data.Name,
          Firstname: data.Firstname,
          Matiere: data.Matiere,
          Etoiles: data.Etoiles,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données de l’éducateur', error);
      }
    };

    const fetchDisponibilites = async () => {
      try {
        const response = await fetch(`https://access-backend-a961a1f4abb2.herokuapp.com/api/get_dispo/${npi}`);
        const data = await response.json();
        
        if (data.error) {
          console.error(data.error);
        } else {
          const dispoList = [data.Dispo1, data.Dispo2, data.Dispo3, data.Dispo4].filter(Boolean);
          setDisponibilites(dispoList);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des disponibilités', error);
      }
    };

    const fetchChildrenData = async () => {
      if (!user.NPI || user.NPI.trim() === '') {
        console.error('Le NPI de l\'utilisateur est invalide ou manquant');
        return; // Ne pas continuer si le NPI est invalide
      }
  
      try {
        const response = await fetch(`https://access-backend-a961a1f4abb2.herokuapp.com/api/list_enfants/${user.NPI}`);
        const data = await response.json();
        
        if (data.success) {
          const enfants: Enfant[] = data.data; // On assume que `data.data` contient la liste des enfants
          setChildrenList(enfants);
        } else {
          console.error('Erreur dans la récupération des enfants', data.message);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des enfants', error);
      }
    };

    fetchUserData();
    fetchEducateurData();
    fetchDisponibilites();
    if (user.NPI && user.NPI.trim() !== '') {
      fetchChildrenData(); // Charger les enfants si NPI est valide
    }

  }, [user.NPI, npi]);

  const dureeList = ['1 mois', '2 mois', '3 mois', '4 mois', '5 mois', '6 mois'];

  const generateReference = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  let reference = '';
  
  // Générer 4 lettres aléatoires
  for (let i = 0; i < 4; i++) {
    reference += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Générer 8 chiffres aléatoires
  for (let i = 0; i < 8; i++) {
    reference += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  return reference;
};

const handleSubmit = async () => {
  if (!selectedChild || !selectedDuree || !selectedSeance1 ) {
    Alert.alert('Veuillez remplir tous les champs');
    return;
  }

  const reference = generateReference(); // Générer la référence unique

  const payload = {
    Reference_tutorat: reference,
    NPI_parent: user.NPI,
    NPI_educateur: educateur.NPI,
    NPI_enfant: selectedChild,
    Duree_tutorat: selectedDuree,
    Seance1: selectedSeance1,
    Seance2: selectedSeance2
  };

  try {
    const response = await fetch('https://access-backend-a961a1f4abb2.herokuapp.com/api/add_tutorat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // Vérifiez le code de statut HTTP pour détecter les erreurs avant de traiter la réponse
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur HTTP:', response.status, errorData);
      return;
    }

    // Traitement de la réponse réussie
    const data = await response.json();
    console.log('Réponse de l\'API:', data);

    // Vérifiez si le message est présent
    if (data && data.Message) {
      console.log('Tutorat ajouté avec succès:', data.Message);
      console.log('Référence tutorat:', data.Reference_tutorat);

      // Afficher une alerte de succès
      Alert.alert(
        'Tutorat ajouté', // Titre de l'alerte
        'Le tutorat a été ajouté avec succès !', // Message de l'alerte
        [
          {
            text: 'OK',
            onPress: () => {
              // Rediriger après avoir cliqué sur "OK"
              router.push('/EducateursFolder/Educateurs');  // Changez le chemin vers la page de votre choix
            }
          }
        ],
        { cancelable: false } // L'alerte ne peut pas être fermée en dehors de l'option OK
      );
    } else {
      console.error('Erreur lors de l\'ajout du tutorat', data.error || 'Message d\'erreur inconnu');
    }
  } catch (error) {
    console.error('Erreur lors de la requête API', error);
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Ajouter éducateur</Text>
          <Text style={styles.subtitle}>Assigner l'éducateur à un enfant</Text>
        </View>
      </View>

      <View style={styles.avatarContainer}>
        <TouchableOpacity style={styles.avatarWrapper}>
          <Image source={{ uri: 'https://i.postimg.cc/k4MRhY0L/El-ve.png' }} style={styles.avatar} />
        </TouchableOpacity>
        <Text style={styles.nameText}>
          <Text style={styles.boldText}>{educateur.Name} {educateur.Firstname}</Text>
        </Text>
        <Text style={styles.professionText}>Enseignant de {educateur.Matiere}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(Math.floor(educateur.Etoiles))].map((_, index) => (
            <Text key={index} style={styles.star}>★</Text>
          ))}
          <Text style={styles.ratingText}> {educateur.Etoiles}</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Compléter les informations</Text>

        <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <Picker
              selectedValue={selectedChild}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedChild(itemValue)}
            >
              <Picker.Item label="Choisir un enfant" value="" />
              {childrenList.map((child) => (
                <Picker.Item
                  key={child.NPI_enfant}
                  label={`${child.Nom_enfant} ${child.Prenom_enfant}`}
                  value={child.NPI_enfant} // On utilise `NPI_enfant` comme valeur
                />
              ))}
            </Picker>

            <Picker
              selectedValue={selectedDuree}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedDuree(itemValue)}
            >
              <Picker.Item label="Durée du tutorat" value="" />
              {dureeList.map((duree, index) => (
                <Picker.Item key={index} label={duree} value={duree} />
              ))}
            </Picker>

            <Picker
              selectedValue={selectedSeance1}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedSeance1(itemValue)}
            >
              <Picker.Item label="1ère séance" value="" />
              {disponibilites.map((dispo, index) => (
                <Picker.Item key={index} label={dispo} value={dispo} />
              ))}
            </Picker>

            <Picker
              selectedValue={selectedSeance2}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedSeance2(itemValue)}
            >
              <Picker.Item label="2ème séance" value="" />
              {filteredSeance2.map((dispo, index) => (
                <Picker.Item key={index} label={dispo} value={dispo} />
              ))}
            </Picker>

          </View>
        </ScrollView>
        
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Assigner</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: '#fff', 
    padding: 15 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#282828', 
    fontFamily: 'Montserrat_700Bold' 
  },
  subtitle: { 
    fontSize: 12, 
    color: '#7F7F7F', 
    textAlign: 'center', 
    fontFamily: 'Montserrat_400Regular', 
    marginTop: 5 
  },
  avatarContainer: { 
    alignItems: 'center', 
    marginTop: 20 
  },
  avatarWrapper: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    borderColor: '#0a4191', 
    borderWidth: 2, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#e0e0e0' 
  },
  avatar: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 50 
  },
  formContainer: { 
    marginTop: 15,
    height: 280, // Hauteur fixe pour forcer le scroll
    overflow: 'hidden',
  },
  formScroll: {
    height: 200, // Permet le scroll des champs
  },
  formTitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#282828', 
    textAlign: 'center', 
    marginBottom: 20, 
    fontFamily: 'Montserrat_700Bold' 
  },
  form: { 
    width: '100%', 
    gap: 10 
  },
  picker: { 
    height: 50, 
    borderColor: '#D1D5DB', 
    borderWidth: 1, 
    borderRadius: 15, 
    paddingHorizontal: 12, 
    marginBottom: 5, 
    fontFamily: 'Montserrat_400Regular', 
    fontSize: 12,
    color: '#282828',
  },
  button: { 
    height: 45, 
    backgroundColor: '#0a4191', 
    paddingVertical: 15, 
    borderRadius: 15, 
    alignItems: 'center', 
    marginTop: 10, 
  },
  buttonText: { 
    color: '#F3F1FF', 
    fontSize: 12, 
    fontWeight: '500', 
    fontFamily: 'Montserrat_700Bold' 
  },
  nameText: { 
    marginTop: 10, 
    fontSize: 14, 
    fontFamily: 'Montserrat_700Bold', 
    color: '#282828' 
  },
  boldText: { 
    fontWeight: 'bold' 
  },
  professionText: { 
    fontSize: 12, 
    fontFamily: 'Montserrat_400Regular', 
    color: '#7F7F7F' 
  },
  ratingContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 5 
  },
  star: { 
    color: '#FFD700', 
    fontSize: 14 
  },
  ratingText: { 
    fontSize: 12, 
    fontFamily: 'Montserrat_400Regular', 
    color: '#282828' 
  },
});
