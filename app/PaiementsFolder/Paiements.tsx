import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import {Linking} from 'react-native';

export default function Paiements() {
  const [activeTab, setActiveTab] = useState<'en attente' | 'effectué'>('en attente');
  const [paiementsEnAttente, setPaiementsEnAttente] = useState<any[]>([]);
  const [paiementsEffectues, setPaiementsEffectues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState({
    NPI: '',
    nom: '',
    prenom: '',
    email: '',
    role: '',
  });


  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const userData = await SecureStore.getItemAsync('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser({
          NPI: parsedUser.NPI || '',
          nom: parsedUser.Name || '',
          prenom: parsedUser.Firstname || '',
          email: parsedUser.Email || '',
          role: parsedUser.Role || '',
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur', error);
    }
  };

  fetchUserData();
}, []);


  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        const userData = await SecureStore.getItemAsync('user');
        if (!userData) throw new Error('Aucun utilisateur trouvé');

        const { NPI } = JSON.parse(userData);
        if (!NPI) throw new Error('NPI manquant');

        const response = await fetch(`https://mediumvioletred-mole-607585.hostingersite.com/public/api/paiements_attente_parent/${NPI}`, {
          headers: {
            Accept: 'application/json',
          },
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setPaiementsEnAttente(data.en_attente || []);
          setPaiementsEffectues(data.effectues || []);
        } else {
          const errorText = await response.text();
          console.error("Réponse non JSON :", errorText);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des paiements', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaiements();
  }, []);

  const paiements = activeTab === 'en attente' ? paiementsEnAttente : paiementsEffectues;

  const handlePayer = async (paiement: any) => {
  try {
    // Récupérer les infos du payeur (parent) depuis SecureStore (exemple)
    const userData = await SecureStore.getItemAsync('user');
    if (!userData) throw new Error('Utilisateur non connecté');

    const { NPI, nom, prenom, role } = JSON.parse(userData);

    // Préparer les données à envoyer au backend
    const payload = {
      Id_paiement: paiement.Id_paiement, 
      Montant_paiement: paiement.Montant_paiement,
      NPI_payeur: user.NPI,
      Nom_payeur: user.nom,
      Prenom_payeur: user.prenom,
      Email_payeur: user.email,
      Role_payeur: user.role,
      Paiement: paiement.Paiement,
    };


    const response = await fetch('https://mediumvioletred-mole-607585.hostingersite.com/public/api/initier_transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(`Erreur : ${result.message || 'Échec du paiement'}`);
    } else {
      
      Linking.openURL(result.data.url)
       .catch((err) => console.error('Failed to open URL:', err));
    }
  } catch (error) {
    if (error instanceof Error) {
      alert('Erreur lors du paiement : ' + error.message);
    } else {
      alert('Erreur lors du paiement : ' + String(error));
    }
  }
};


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

      {loading ? (
        <ActivityIndicator size="large" color="#0a4191" style={{ marginTop: 30 }} />
      ) : paiements.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20, fontFamily: 'Montserrat_400Regular', fontSize: 12 }}>
          Aucun paiement trouvé.
        </Text>
      ) : (
        paiements.map((p, index) => (
          <View key={index} style={styles.paiementCard}>
            <Image source={{ uri: 'https://i.postimg.cc/13fY6f32/Paiement-effectu.png' }} style={styles.paiementImage} />
            <View style={styles.paiementTextContainer}>
              <Text style={styles.paiementTitle}>{`${p.Nom_educateur} ${p.Prenom_educateur}`}</Text>
              <Text style={styles.paiementDetails}>{`${p.Montant_paiement} FCFA`}</Text>
              <Text style={styles.paiementStatut}>Paiement {activeTab}</Text>
            </View>
            {activeTab === 'effectué' ? (
              <TouchableOpacity style={styles.detailsButton}
              >
                <FontAwesome name="info-circle" size={25} color="#0a4191" style={styles.detailsIcon} onPress={() => router.push(`/PaiementsFolder/DetailsPaiements?ID=${p.Paiement}`)} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.payerButton}
                onPress={() => handlePayer(p)}
              >
                <FontAwesome name="credit-card" size={16} color="#fff" style={styles.payerIcon} />
                <Text style={styles.payerText}>Payer</Text>
              </TouchableOpacity>

            )}
          </View>
        ))
      )}
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
    fontSize: 10,
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
});
