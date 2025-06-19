import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, SafeAreaView, ScrollView,
  TouchableOpacity, StyleSheet, ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const profileImageUrl = 'https://i.postimg.cc/9FqSnKGz/Accueil.jpg';

type EducatorCardProps = {
  name: string;
  subject: string;
  rating: number;
  zone: string;
  npi: string;
  photo?: string;
};

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [educators, setEducators] = useState<EducatorCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState({
    nomPrenoms: '',
    npi: ''
  });
  const [enfantCount, setEnfantCount] = useState<number | null>(null);
  const [educateurCount, setEducateurCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
  try {
    const userData = await SecureStore.getItemAsync('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      const currentNpi = `${parsedUser.NPI}` || '';

      setUser({
        nomPrenoms: `${parsedUser.Firstname}${parsedUser.Name}` || '',
        npi: currentNpi,
      });

      // Appel API count enfants
      const enfantsRes = await fetch(`https://mediumvioletred-mole-607585.hostingersite.com/public/api/count_enfants/${currentNpi}`);
      const enfantsData = await enfantsRes.json();
      setEnfantCount(enfantsData.enfants_uniques);

      // Appel API count éducateurs
      const educateursRes = await fetch(`https://mediumvioletred-mole-607585.hostingersite.com/public/api/count_educateurs/${currentNpi}`);
      const educateursData = await educateursRes.json();
      setEducateurCount(educateursData.educateurs_uniques);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur et des compteurs', error);
  }
};

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchEducators = async () => {
      try {
        const response = await fetch('https://mediumvioletred-mole-607585.hostingersite.com/public/api/get_all_educateurs');
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Données inattendues');
        }

        const formattedData = data.map((educator) => ({
          name: `${educator.Firstname} ${educator.Name}`,
          subject: educator.Matiere,
          rating: educator.Etoiles ?? 0,
          zone: 'Non spécifié',
          npi: educator.NPI,
          photo: `data:image/jpeg;base64,${educator.Photo_educateur}`, // <- ici
        }));
        setEducators(formattedData);
      } catch (error) {
        console.error('Erreur lors de la récupération des éducateurs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducators();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>Salut,</Text>
            <Text style={styles.username}>{user.nomPrenoms}</Text>
          </View>
          <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
        </View>

        <View style={styles.dashboardDivider} />

        <Text style={styles.dashboardTitle}>Tableau de bord</Text>

        <View style={styles.tilesContainer}>
          <TouchableOpacity style={styles.tile} onPress={() => router.push('/EnfantsFolder/ListEnfants')}>
            <View style={styles.tileContent}>
              <View>
                <Text style={styles.tileLabel}>Mes enfants</Text>
                <View style={styles.tileNumberRow}>
                  <Text style={styles.tileNumber}>{enfantCount !== null ? enfantCount : '0'}</Text>
                  <Feather name="arrow-up-right" size={18} color="#1E40AF" style={{ marginLeft: 6 }} />
                </View>
              </View>
              <View style={styles.tileIconContainer}>
                <View style={styles.circleIcon}>
                  <Feather name="users" size={16} color="#FFC107" />
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tile} onPress={() => router.push('/EducateursFolder/Educateurs')}>
            <View style={styles.tileContent}>
              <View>
                <Text style={styles.tileLabel}>Mes éducateurs</Text>
                <View style={styles.tileNumberRow}>
                  <Text style={styles.tileNumber}>{educateurCount !== null ? educateurCount : '0'}</Text>
                  <Feather name="arrow-up-right" size={18} color="#1E40AF" style={{ marginLeft: 6 }} />
                </View>
              </View>
              <View style={styles.tileIconContainer}>
                <View style={styles.circleIcon}>
                  <Feather name="award" size={16} color="#FFC107" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.educatorsSection}>
        <Text style={styles.educatorsSectionTitle}>Éducateurs populaires</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0A4191" />
        ) : educators.length > 0 ? (
          educators.map((educator, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardContent}>
                <Image
                  source={{ uri: educator.photo || 'https://via.placeholder.com/40' }}
                  style={styles.avatar}
                />
                <View style={styles.info}>
                  <Text style={styles.name}>{educator.name}</Text>
                  <Text style={styles.subject}>{educator.subject}</Text>
                  <View style={styles.ratingContainer}>
                    {[...Array(5)].map((_, i) => (
                      <Feather
                        key={i}
                        name="star"
                        size={16}
                        color={i < Math.round(educator.rating) ? '#FFD700' : '#E0E0E0'}
                      />
                    ))}
                    <Text style={styles.rating}>{educator.rating.toFixed(1)}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push(`/EducateursFolder/FinaliserAjout?npi=${educator.npi}`)}>
                  <Feather name="user-plus" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.infoButton} onPress={() => router.push(`/EducateursFolder/EducateursNC?npi=${educator.npi}`)}>
                  <Feather name="info" size={20} color="#0A4191" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noEducators}>Aucun éducateur trouvé.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E40AF' },
  headerBackground: {
    backgroundColor: '#0a4191',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
  },
  headerTextContainer: { flex: 1 },
  greeting: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Montserrat_400Regular',
  },
  username: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
  },
  dashboardDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    marginVertical: 12,
  },
  dashboardTitle: {
    color: 'white',
    fontSize: 14,
    marginBottom: 1,
    fontFamily: 'Montserrat_700Bold',
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'white',
  },
  tilesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    paddingTop: 16,
  },
  tile: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tileContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tileLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Montserrat_400Regular',
  },
  tileNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tileNumber: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Montserrat_700Bold',
  },
  tileIconContainer: { justifyContent: 'flex-start' },
  circleIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  educatorsSection: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 2,
    padding: 16,
  },
  educatorsSectionTitle: {
    fontSize: 14,
    marginBottom: 12,
    fontFamily: 'Montserrat_700Bold',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    minHeight: 80,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#EEE',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Montserrat_700Bold',
  },
  subject: {
    fontSize: 10,
    color: '#7F7F7F',
    fontFamily: 'Montserrat_400Regular',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  rating: {
    fontSize: 10,
    color: '#7F7F7F',
    marginLeft: 5,
    fontFamily: 'Montserrat_400Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  addButton: {
    height: 35,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    borderRadius: 12,
    marginRight: 5,
  },
  infoButton: {
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
  },
  noEducators: {
    fontSize: 14,
    color: '#7F7F7F',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Montserrat_400Regular',
  },
});

export default Dashboard;
