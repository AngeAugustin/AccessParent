import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Educateurs() {
  const router = useRouter();

  // Exemple de données pour le tableau des éducateurs avec des identifiants uniques
  const educateursData = [
    { id: '1', nomPrenom: 'Jean Dupont', matière: 'SVT' },
    { id: '2', nomPrenom: 'Paul Lefevre', matière: 'Anglais' },
    { id: '3', nomPrenom: 'Marie Claire', matière: 'Histoire-Géographie' },
  ];

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

        {educateursData.map((educateur) => (
          <View key={educateur.id} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.columnEducateur]}>{educateur.nomPrenom}</Text>
            <Text style={[styles.tableCell, styles.columnMatiere]}>{educateur.matière}</Text>
            <TouchableOpacity 
              style={[styles.detailsButton, styles.columnDetails]}
              onPress={() => router.push(`/EducateursFolder/DetailsEducateurs`)} // Redirection vers la page DetailsEducateurs
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
