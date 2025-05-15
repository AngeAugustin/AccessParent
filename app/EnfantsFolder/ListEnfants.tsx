import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as SecureStore from 'expo-secure-store'; 

// Définition du type pour un enfant
interface Enfant {
  NPI_enfant: string;
  Nom_enfant: string;
  Prenom_enfant: string;
}

export default function ListEnfants() {
  const router = useRouter();
  const [user, setUser] = useState<{ NPI: string }>({ NPI: '' });
  const [enfantsData, setEnfantsData] = useState<Enfant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await SecureStore.getItemAsync('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser({ NPI: parsedUser.NPI || '' });

          // Appeler l'API avec le NPI récupéré
          fetchEnfants(parsedUser.NPI);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur', error);
      }
    };

    fetchUserData();
  }, []);

  const fetchEnfants = async (NPI: string) => {
    try {
      const response = await fetch(`https://mediumvioletred-mole-607585.hostingersite.com/public/api/list_enfants/${NPI}`);
      const data = await response.json();

      if (data.success) {
        setEnfantsData(data.data as Enfant[]); // Cast explicite pour éviter `never`
      } else {
        setEnfantsData([]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des enfants :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mes enfants</Text>
          <Text style={styles.subtitle}>Gérer mes enfants</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/EnfantsFolder/AjouterEnfant')}
        >
          <Icon name="person-add" size={20} color="#fff" />
          <Text style={styles.addText}>Ajouter un enfant</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.columnEnfant]}>Enfant</Text>
          <Text style={[styles.tableHeaderText, styles.columnDetails]}>Détails</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0a4191" style={{ marginTop: 20 }} />
        ) : (
          enfantsData.length > 0 ? (
            enfantsData.map((enfant, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.columnEnfant]}>
                  {`${enfant.Nom_enfant} ${enfant.Prenom_enfant}`}
                </Text>
                <TouchableOpacity 
                  style={[styles.detailsButton, styles.columnDetails]}
                  onPress={() => router.push(`/EnfantsFolder/DetailsEnfant?NPI_enfant=${enfant.NPI_enfant}`)} 
                >
                  <Icon name="info-outline" size={24} color="#0a4191" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>Aucun enfant trouvé.</Text>
          )
        )}
      </View>

      {/* Nouveau bouton Voir mes enfants assignés */}
      <TouchableOpacity
        style={styles.assignedButton}
        onPress={() => router.push('/EnfantsFolder/EnfantsAssignes')}
      >
        <Icon name="assignment" size={25} color="#fff" />
        <Text style={styles.addText}>Voir mes enfants déjà assignés</Text>
      </TouchableOpacity>
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
  addButton: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a4191',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  assignedButton: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7931e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 70,
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
  columnEnfant: {
    flex: 3,
    textAlign: 'left',
    paddingLeft: 10,
  },
  columnDetails: {
    flex: 1,
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: '#7F7F7F',
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 10,
  },
});
