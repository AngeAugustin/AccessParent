import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useFonts } from 'expo-font';

// Déclaration du type de l'historique
interface Historique {
  Id_seance: string;
  Date_seance: string;
  Heure_seance: string;
  Observation: string;
  Travail_effectue: string;
}

export default function DetailsEnfants() {
  const router = useRouter();
  const [isMenuVisible, setMenuVisible] = useState(false); // État pour le menu
  const { Reference_tutorat } = useLocalSearchParams();
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const [historiques, setHistoriques] = useState<Historique[]>([]); // On change le type ici pour un tableau d'historique
  const [selectedTravail, setSelectedTravail] = useState<string>(''); // Nouveau state pour stocker le travail effectué sélectionné
  const [loading, setLoading] = useState<boolean>(true); // Indicateur de chargement
  const [error, setError] = useState<string>(''); // État pour gérer les erreurs

  useEffect(() => {
    const fetchHistoriques = async () => {
      try {
        const response = await fetch(`https://mediumvioletred-mole-607585.hostingersite.com/AccessBackend/public/api/get_historique_seance/${Reference_tutorat}`);
        const data = await response.json();

        if (data.status === 200) {
          setHistoriques(data.data); // On met directement l'array dans l'état
        } else {
          setError('Aucun historique trouvé pour cet enfant.');
        }
      } catch (error) {
        setError('Erreur lors de la récupération des données.');
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    if (Reference_tutorat) {
      fetchHistoriques();
    }
  }, [Reference_tutorat]);

  // Si les polices ne sont pas encore chargées ou si les infos ne sont pas encore récupérées
  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a4191" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // Fonction pour ouvrir le modal et afficher le travail effectué
  const handleOpenModal = (travail: string) => {
    setSelectedTravail(travail);
    setMenuVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Détails du suivi de l'enfant</Text>
        </View>
      </View>

      <Text style={styles.DetailsTitle}>Historique des séances</Text>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.columnDate]}>Date du jour</Text>
          <Text style={[styles.tableHeaderText, styles.columnDuree]}>Durée</Text>
          <Text style={[styles.tableHeaderText, styles.columnTravail]}>Travail effectué</Text>
          <Text style={[styles.tableHeaderText, styles.columnObservations]}>Observations</Text>
        </View>

        {/* On affiche le message d'absence de données si historique est vide */}
        {historiques.length > 0 ? (
          historiques.map((historique) => (
            <View key={historique.Id_seance} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.columnDate]}>{historique.Date_seance}</Text>
              <Text style={[styles.tableCell, styles.columnDuree]}>{historique.Heure_seance}</Text>
              <TouchableOpacity
                style={[styles.historiqueIcon, styles.columnTravail]}
                onPress={() => handleOpenModal(historique.Travail_effectue)} // Ouvre le menu et passe le travail effectué
              >
                <Icon name="history" size={24} color="#0a4191" />
              </TouchableOpacity>
              <Text style={[styles.tableCell, styles.columnObservations]}>{historique.Observation}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>Aucun historique trouvé pour cet enfant.</Text>
        )}
      </View>

      {/* Modal pour le menu */}
      <Modal
        visible={isMenuVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMenuVisible(false)} // Ferme le menu en appuyant sur le bouton retour
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Travaux effectués</Text>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.textContainer}>
                <Text style={styles.textContent}>
                  {selectedTravail || 'Aucun travail effectué à afficher.'} {/* Affiche le travail effectué */}
                </Text>
              </View>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMenuVisible(false)} // Ferme le menu
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#0a4191',
    marginTop: 10,
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
  historiqueIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalContent: {
    paddingVertical: 8,
  },
  textContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  textContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: 'orange',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  DetailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282828',
    textAlign: 'center',
    marginBottom: 0,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 15,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#282828',
    marginTop: 20,
  },
  columnDate: {
    flex: 1,
    textAlign: 'left',
    paddingLeft: 10,
  },
  columnDuree: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnTravail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnObservations: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
