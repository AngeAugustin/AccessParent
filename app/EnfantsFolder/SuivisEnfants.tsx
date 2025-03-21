import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function DetailsEnfants() {
  const router = useRouter();
  const [isMenuVisible, setMenuVisible] = useState(false); // État pour le menu

  const details = [
    { id: '1', date: '15/01/2025', duree: '2 heures', travail: 'Historique', observations: 'Pas mal' },
    { id: '2', date: '20/12/2024', duree: '2 heures', travail: 'Historique', observations: 'Acceptable.' },
  ];

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

        {details.map((detail, index) => (
          <View key={detail.id} style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.columnDate]}>{detail.date}</Text>
          <Text style={[styles.tableCell, styles.columnDuree]}>{detail.duree}</Text>
          <TouchableOpacity
            style={[styles.historiqueIcon, styles.columnTravail]}
            onPress={() => setMenuVisible(true)} // Ouvre le menu
          >
            <Icon name="history" size={24} color="#0a4191" />
          </TouchableOpacity>
          <Text style={[styles.tableCell, styles.columnObservations]}>{detail.observations}</Text>
        </View>
        ))}
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
                  Exemple de travaux effectués : {"\n"}
                  - Lecture d'un texte narratif. {"\n"}
                  - Analyse grammaticale. {"\n"}
                  - Révision des bases en mathématiques.
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
