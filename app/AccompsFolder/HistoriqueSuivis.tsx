import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HistoriqueSuivis() {
  // URL de l'image commune
  const commonImageUrl = 'https://i.postimg.cc/6qw7XJFf/S-ance.png';

  const [isMenuVisible, setMenuVisible] = useState(false); // État pour le menu

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mon accompagnateur</Text>
          <Text style={styles.subtitle}>Historique des suivis</Text>
        </View>
      </View>

      <View style={styles.historiqueContainer}>
        {[
          {
            id: '000457',
            date: '21/10/25',
            hours: '18H-20H',
            feedback: 'Bien. Peut mieux faire',
          },
          {
            id: '000429',
            date: '18/10/25',
            hours: '18H-20H',
            feedback: 'Bien.',
          },
          {
            id: '000397',
            date: '13/10/25',
            hours: '18H-20H',
            feedback: 'Acceptable.',
          },
        ].map((entry) => (
          <View key={entry.id} style={styles.historiqueItem}>
            <Image
              source={{ uri: commonImageUrl }}
              style={styles.historiqueImage}
              resizeMode="contain"
            />
            <View style={styles.textContainer}>
              <Text style={styles.historiqueTitle}>Accomp {entry.id}</Text>
              <Text style={styles.historiqueDetails}>{`${entry.date} - ${entry.hours}`}</Text>
              <Text style={styles.historiqueFeedback}>{entry.feedback}</Text>
            </View>
            <TouchableOpacity style={styles.menuButton}
            onPress={() => setMenuVisible(true)}>
              <Icon name="more-vert" size={24} color="#0A4191" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

          <Modal
              visible={isMenuVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setMenuVisible(false)} // Ferme le menu en appuyant sur le bouton retour
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Observations</Text>
                  <ScrollView contentContainerStyle={styles.modalContent}>
                    <View style={styles.textContaine}>
                      <Text style={styles.textContent}>
                        Avec un peu de pratique Henry peut s'améliorer {"\n"}
                        Alaric est un peu trop distrait {"\n"}
                        Rita ne révise pas souvent ses leçons {"\n"}
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
    marginBottom: 20,
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
  historiqueContainer: {
    marginTop: 10,
  },
  historiqueItem: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  historiqueImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  historiqueTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282828',
    fontFamily: 'Montserrat_700Bold',
  },
  historiqueDetails: {
    fontSize: 12,
    color: '#282828',
    fontFamily: 'Montserrat_400Regular',
  },
  historiqueFeedback: {
    fontSize: 12,
    color: '#7F7F7F',
    fontFamily: 'Montserrat_400Regular',
  },
  menuButton: {
    padding: 5,
    height: 35,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 0,
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
  textContaine: {
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
});
