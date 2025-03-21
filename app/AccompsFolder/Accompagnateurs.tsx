import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Accompagnateurs() {
  const router = useRouter();

  // Exemple de données pour une seule ligne d'accompagnateur
  const accompagnateur = { id: '1', nomPrenom: 'Sophie Martin', historique: 'Historique' };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mon accomp</Text>
          <Text style={styles.subtitle}>Gérer accompagnateurs</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/AccompsFolder/AjouterAccompagnateur')}
        >
          <Icon name="person-add" size={20} color="#fff" />
          <Text style={styles.addText}>Ajouter un accomp</Text>
        </TouchableOpacity>
      </View> 
      
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.columnAccompagnateur]}>Accompagnateur</Text>
          <Text style={[styles.tableHeaderText, styles.columnHistorique]}>Historique des suivis</Text>
          <Text style={[styles.tableHeaderText, styles.columnDetails]}>Détails</Text>
        </View>

        <View key={accompagnateur.id} style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.columnAccompagnateur]}>{accompagnateur.nomPrenom}</Text>
          <TouchableOpacity style={[styles.historiqueIcon, styles.columnHistorique]}
           onPress={() => router.push(`/AccompsFolder/HistoriqueSuivis`)} // Redirection vers la page DetailsAccompagnateurs
          >
            <Icon name="history" size={24} color="#0a4191" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.detailsButton, styles.columnDetails]}
            onPress={() => router.push(`/AccompsFolder/DetailsAccompagnateurs`)} // Redirection vers la page DetailsAccompagnateurs
          >
            <Icon name="info-outline" size={24} color="#0a4191" />
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
  addButton: {
    height: 35,
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
  historiqueIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnAccompagnateur: {
    flex: 1.5, // Colonne plus large pour les noms des accompagnateurs
    textAlign: 'left',
    paddingLeft: 10,
  },
  columnHistorique: {
    flex: 1, // Taille ajustée pour l'icône historique
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnDetails: {
    flex: 1, // Taille ajustée pour l'icône détails
    justifyContent: 'center',
    alignItems: 'center',
  },
});
