import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as SecureStore from 'expo-secure-store'; 

// Définition du type pour un assigne
interface Assigne {
  Reference_tutorat: string;
  Nom_enfant: string;
  Prenom_enfant: string;
  Matiere: string;
}

export default function EnfantsAssignes() {
  const router = useRouter();
  const [user, setUser] = useState<{ NPI: string }>({ NPI: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [assignes, setAssignes] = useState<Assigne[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await SecureStore.getItemAsync('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser({ NPI: parsedUser.NPI || '' });

          // Appeler l'API avec le NPI récupéré
          fetchAssignes(parsedUser.NPI);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur', error);
      }
    };

    fetchUserData();
  }, []);

  const fetchAssignes = async (NPI: string) => {
    try {
      const response = await fetch(`https://access-backend-a961a1f4abb2.herokuapp.com/api/get_assignes/${NPI}`);
      const data = await response.json();

      if (response.ok && data.status === 200) {
        // Assurez-vous de récupérer les données sous la clé "data"
        setAssignes(data.data as Assigne[]);
      } else {
        setAssignes([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des enfants:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mes enfants assignés</Text>
          <Text style={styles.subtitle}>Gérer mes enfants déjà assignés</Text>
        </View>
      </View>
      
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.columnEnfant]}>Enfant</Text>
          <Text style={[styles.tableHeaderText, styles.columnMatiere]}>Matière</Text>
          <Text style={[styles.tableHeaderText, styles.columnDetails]}>Détails</Text>
        </View>

        {assignes.length > 0 ? (
          assignes.map((assigne, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.columnEnfant]}>{assigne.Nom_enfant} {assigne.Prenom_enfant}</Text>
              <Text style={[styles.tableCell, styles.columnMatiere]}>{assigne.Matiere}</Text>
              <TouchableOpacity 
                style={[styles.detailsButton, styles.columnDetails]}
                onPress={() => router.push(`/EnfantsFolder/SuivisEnfants?Reference_tutorat=${assigne.Reference_tutorat}`)} 
              >
                <Icon name="info-outline" size={24} color="#0a4191" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>Aucun enfant assigné trouvé</Text>
        )}
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
  columnEnfant: {
    flex: 3,
    textAlign: 'left',
    paddingLeft: 10,
  },
  columnMatiere: {
    flex: 2,
    textAlign: 'center',
  },
  columnDetails: {
    flex: 1,
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: '#282828',
    marginTop: 20,
  },
});
