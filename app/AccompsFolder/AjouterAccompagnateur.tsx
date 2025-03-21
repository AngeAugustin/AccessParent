import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

type AccompCardProps = {
  name: string;
  profession: string;
  rating: number;
  zone: string;
};

const AccompCard: React.FC<AccompCardProps> = ({ name, profession, rating, zone }) => {
  const router = useRouter();

  const handleAddAccomp = () => {
    router.push('/AccompsFolder/FinaliserAccomp');
  };

  const handleInfoAccomp = () => {
    router.push('/AccompsFolder/AccompsNC');
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.subject}>{profession}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, index) => (
              <Icon
                key={index}
                name="star"
                size={16}
                color={index < Math.round(rating) ? '#FFD700' : '#E0E0E0'}
              />
            ))}
            <Text style={styles.rating}>{rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddAccomp}>
          <Icon name="person-add" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoButton} onPress={handleInfoAccomp}>
          <Icon name="info" size={20} color="#0A4191" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function AjouterAccompagnateur() {
  const [selectedProfession, setSelectedProfession] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('');

  const professionList = ['Professeur', 'Etudiant'];
  const zoneList = ['Cotonou', 'Calavi', 'Fidjrossè'];

  const accomps = [
    { name: 'M. DOSSOU Franck', profession: 'Professeur', rating: 4.2, zone: 'Cotonou' },
    { name: 'M. OLAWALE Kola', profession: 'Etudiant', rating: 4.2, zone: 'Cotonou' },
    { name: 'Mme ZITA Amber', profession: 'Etudiant', rating: 3.7, zone: 'Calavi' },
    { name: 'M. FACHEHOUN Augustin', profession: 'Professeur', rating: 3.2, zone: 'Fidjrossè' },
  ];

  const filteredAccomps = accomps.filter((accomp) => {
    const matchesProfession = selectedProfession ? accomp.profession.includes(selectedProfession) : true;
    const matchesZone = selectedZone ? accomp.zone.includes(selectedZone) : true;

    return matchesProfession && matchesZone;
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Ajouter accompagnateur</Text>
          <Text style={styles.subtitle}>Rechercher</Text>
        </View>
      </View>

      <Text style={styles.searchTitle}>Choix et Assignation</Text>

      <View style={styles.filtersContainer}>
        <Picker
          selectedValue={selectedProfession}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedProfession(itemValue)}
        >
          <Picker.Item label="Profession/Métier" value="" />
          {professionList.map((profession, index) => (
            <Picker.Item key={index} label={profession} value={profession} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedZone}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedZone(itemValue)}
        >
          <Picker.Item label="Zone géographique" value="" />
          {zoneList.map((zone, index) => (
            <Picker.Item key={index} label={zone} value={zone} />
          ))}
        </Picker>
      </View>

      {filteredAccomps.length > 0 ? (
        filteredAccomps.map((accomp, index) => (
          <AccompCard
            key={index}
            name={accomp.name}
            profession={accomp.profession}
            rating={accomp.rating}
            zone={accomp.zone}
          />
        ))
      ) : (
        <Text style={styles.noAccomps}>Aucun accompagnateur trouvé avec ces critères.</Text>
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
    textAlign: 'left',
    fontFamily: 'Montserrat_400Regular',
    marginTop: 5,
    marginBottom: 15,
  },
  searchTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282828',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Montserrat_700Bold',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  picker: {
    height: 50,
    flex: 1,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 12,
    marginBottom: 5,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#282828',
    backgroundColor: '#fff',
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
    flexWrap: 'wrap', // Permet aux éléments de se déplacer à la ligne
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
    backgroundColor: '#0A4191',
    marginRight: 10,
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
    flexShrink: 1, // Permet aux boutons de rétrécir
    justifyContent: 'flex-end',
    flexWrap: 'wrap', // Permet aux boutons de se déplacer si nécessaire
  },
  addButton: {
    height: 35,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    borderRadius: 12,
    marginRight: 5,  // Ajoute un espacement entre les boutons
     // Limite la largeur à 30% de la card
  },
  infoButton: {
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
     // Limite la largeur à 30% de la card
  },
  noAccomps: {
    fontSize: 14,
    color: '#7F7F7F',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Montserrat_400Regular',
  },
});
