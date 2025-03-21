import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const paiements = [
  { id: 1, actor: 'M. KOLA Bashorun', enfant: 'Ange Kadoukpè', valeur: '16 heures', statut: 'en attente' },
  { id: 2, actor: 'Mme ZITA Amber', enfant: 'Enfant 2', valeur: '16 heures', statut: 'en attente' },
  { id: 3, actor: 'M. André LALEYE', enfant: '', valeur: '16 heures', statut: 'en attente' },
  { id: 4, actor: 'M. Afolabi Akiwalé', enfant: 'Enfant 2', valeur: '16 heures', statut: 'effectué' },
];

export default function Paiements() {
  const [activeTab, setActiveTab] = useState('en attente');
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mes paiements</Text>
          <Text style={styles.subtitle}>Gérer mes paiements</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'en attente' && styles.activeTab]}
          onPress={() => setActiveTab('en attente')}
        >
          <Text style={[styles.tabText, activeTab === 'en attente' && styles.activeTabText]}>Paiements en attente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'effectué' && styles.activeTab]}
          onPress={() => setActiveTab('effectué')}
        >
          <Text style={[styles.tabText, activeTab === 'effectué' && styles.activeTabText]}>Paiements effectués</Text>
        </TouchableOpacity>
      </View>

      {paiements.filter(p => p.statut === activeTab).map(p => (
        <View key={p.id} style={styles.paiementCard}>
          <Image source={{ uri: 'https://i.postimg.cc/13fY6f32/Paiement-effectu.png' }} style={styles.paiementImage} />
          <View style={styles.paiementTextContainer}>
            <Text style={styles.paiementTitle}>{p.actor}</Text>
            {p.enfant ? <Text style={styles.paiementDetails}>{`${p.enfant} - ${p.valeur}`}</Text> : null}
            <Text style={styles.paiementStatut}>Paiement {p.statut}</Text>
          </View>
          {p.statut === 'effectué' ? (
            <TouchableOpacity style={styles.detailsButton}>
              <FontAwesome name="info-circle" size={25} color="#0a4191" style={styles.detailsIcon} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.payerButton}>
              <FontAwesome name="credit-card" size={16} color="#fff" style={styles.payerIcon} />
              <Text style={styles.payerText}>Payer</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
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
  tabs: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#0a4191',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#282828',
    fontFamily: 'Montserrat_700Bold',
  },
  activeTabText: {
    color: '#fff',
  },
  paiementCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paiementImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  paiementTextContainer: {
    flex: 1,
  },
  paiementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#282828',
    fontFamily: 'Montserrat_700Bold',
  },
  paiementDetails: {
    fontSize: 10,
    color: '#555',
    fontFamily: 'Montserrat_400Regular',
  },
  paiementStatut: {
    fontSize: 10,
    color: '#888',
    fontFamily: 'Montserrat_400Regular',
  },
  payerButton: {
    backgroundColor: '#0a4191',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  payerIcon: {
    marginRight: 5,
  },
  payerText: {
    color: '#F3F1FF', 
    fontSize: 12,
    fontWeight: '500', 
    fontFamily: 'Montserrat_700Bold',
  },
  detailsButton: {
    
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsIcon: {
    marginRight: 5,
  },
  detailsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Montserrat_700Bold',
  },
});
