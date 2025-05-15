import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as SecureStore from 'expo-secure-store'; 

// Définir une interface pour les éducateurs
interface Educateur {
  NPI_educateur: string;
  Name: string;
  Firstname: string;
  Matiere: string;
}

export default function Educateurs() {
  const router = useRouter();
  const [user, setUser] = useState({
      NPI: '',
  });
  const [educateursData, setEducateursData] = useState<Educateur[]>([]);  // Typage explicite des données des éducateurs
  const [selectedEducateurNPI, setSelectedEducateurNPI] = useState<string>(''); // Variable pour stocker le NPI sélectionné

  useEffect(() => {
      // Fonction pour récupérer les données utilisateur depuis SecureStore
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

      fetchUserData();
  }, []);

  useEffect(() => {
    // Fonction pour récupérer les éducateurs depuis l'API après avoir récupéré le NPI
    const fetchEducateursData = async () => {
      if (user.NPI) {
        try {
          const response = await fetch(`https://mediumvioletred-mole-607585.hostingersite.com/public/api/get_tutorat/${user.NPI}`);
          const data = await response.json();

          // Mise à jour de l'état avec les données récupérées de l'API
          setEducateursData(data);
        } catch (error) {
          console.error('Erreur lors de la récupération des données des éducateurs', error);
        }
      }
    };

    if (user.NPI) {
      fetchEducateursData();
    }
  }, [user.NPI]);

  // Fonction pour gérer la redirection vers la page DetailsEducateurs
  const handleDetailsPress = (NPI: string) => {
    setSelectedEducateurNPI(NPI); // Mettre à jour la variable d'état avec le NPI de l'éducateur
    router.push(`/EducateursFolder/DetailsEducateurs?NPI=${NPI}`); // Redirection avec le NPI
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mes éducateurs</Text>
          <Text style={styles.subtitle}>Gérer éducateurs</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/EducateursFolder/AjouterEducateur')}
        >
          <Icon name="person-add" size={20} color="#fff" />
          <Text style={styles.addText}>Ajouter un éducateur</Text>
        </TouchableOpacity>
      </View> 
      
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.columnEducateur]}>Éducateur</Text>
          <Text style={[styles.tableHeaderText, styles.columnMatiere]}>Matière</Text>
          <Text style={[styles.tableHeaderText, styles.columnDetails]}>Détails</Text>
        </View>

        {educateursData.map((educateur, index) => (
          <View key={`${educateur.NPI_educateur}-${index}`} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.columnEducateur]}>
              {`${educateur.Firstname} ${educateur.Name}`}
            </Text>
            <Text style={[styles.tableCell, styles.columnMatiere]}>{educateur.Matiere}</Text>
            <TouchableOpacity 
              style={[styles.detailsButton, styles.columnDetails]}
              onPress={() => handleDetailsPress(educateur.NPI_educateur)}
            >
              <Icon name="info-outline" size={24} color="#0a4191" />
            </TouchableOpacity>
          </View>
        ))}
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
    textAlign: 'left',
    fontFamily: 'Montserrat_400Regular',
    marginTop: 5,
  },
  addButton: {
    height: 35,
    width: 175,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a4191',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Montserrat_700Bold',
  },
  tableContainer: {
    marginTop: 24,
    backgroundColor: '#e0e0e0',
    borderRadius: 24,
    padding: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0a4191',
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  tableHeaderText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Montserrat_400Regular',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  tableCell: {
    fontSize: 10,
    color: '#282828',
    textAlign: 'center',
    fontFamily: 'Montserrat_400Regular',
  },
  detailsButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  columnEducateur: {
    flex: 2, // Colonne plus large pour les noms des éducateurs
    textAlign: 'left',
    paddingLeft: 10,
  },
  columnMatiere: {
    flex: 2, // Taille intermédiaire pour les enfants assignés
    textAlign: 'center',
  },
  columnDetails: {
    flex: 1, // Taille plus petite pour le bouton Détails
    justifyContent: 'center',
    alignItems: 'center',
  },
});
