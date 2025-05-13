import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type EducatorCardProps = {
  name: string;
  subject: string;
  rating: number;
  zone: string;
  npi: string;
  photo?: string;
};

const EducatorCard: React.FC<EducatorCardProps> = ({ npi, name, subject, rating, zone, photo }) => {
  const router = useRouter();

  const handleAddEducator = () => {
    router.push(`/EducateursFolder/FinaliserAjout?npi=${npi}`);
  };

  const handleInfoEducator = () => {
    router.push(`/EducateursFolder/EducateursNC?npi=${npi}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {photo ? (
          <Image source={{ uri: `data:image/jpeg;base64,${photo}` }} style={styles.avatar} />
        ) : (
          <View style={styles.avatar} />
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.subject}>{subject}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, index) => (
              <MaterialIcons
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
        <TouchableOpacity style={styles.addButton} onPress={handleAddEducator}>
          <MaterialIcons name="person-add" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoButton} onPress={handleInfoEducator}>
          <MaterialIcons name="info" size={20} color="#0A4191" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function AjouterEducateur() {
  const [selectedMatiere, setSelectedMatiere] = useState<string>('');
  const [selectedClasse, setSelectedClasse] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [educators, setEducators] = useState<EducatorCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const matiereList = ['Français', 'Mathématiques', 'PCT', 'Anglais', 'Hist-Géo', 'SVT', 'Philosophie', 'Economie'];
  const classeList = ['6ème', '5ème', '4ème'];
  const zoneList = ['Cotonou', 'Calavi', 'Fidjrossè'];

  useEffect(() => {
    const fetchEducators = async () => {
      try {
        const response = await fetch('https://mediumvioletred-mole-607585.hostingersite.com/AccessBackend/public/api/get_all_educateurs');
        const data = await response.json();

        console.log("Données reçues de l'API :", data);

        if (!Array.isArray(data)) {
          console.error("La réponse de l'API n'est pas un tableau :", data);
          throw new Error(data.message || "Données inattendues");
        }

        const formattedData = data.map((educator) => ({
          name: `${educator.Firstname} ${educator.Name}`,
          subject: educator.Matiere,
          rating: educator.Etoiles ?? 0,
          zone: 'Non spécifié',
          npi: educator.NPI,
          photo: educator.Photo_educateur,
        }));

        setEducators(formattedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des éducateurs :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducators();
  }, []);

  const filteredEducators = educators.filter((educator) => {
    const matchesMatiere = selectedMatiere ? educator.subject.includes(selectedMatiere) : true;
    const matchesZone = selectedZone ? educator.zone.includes(selectedZone) : true;
    return matchesMatiere && matchesZone;
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Ajouter éducateur</Text>
          <Text style={styles.subtitle}>Rechercher et Assigner</Text>
        </View>
      </View>

      <Text style={styles.searchTitle}>Choix et Assignation</Text>

      <View style={styles.filtersContainer}>
        <Picker selectedValue={selectedMatiere} style={styles.picker} onValueChange={(itemValue) => setSelectedMatiere(itemValue)}>
          <Picker.Item label="Matière" value="" />
          {matiereList.map((matiere, index) => (
            <Picker.Item key={index} label={matiere} value={matiere} />
          ))}
        </Picker>

        <Picker selectedValue={selectedClasse} style={styles.picker} onValueChange={(itemValue) => setSelectedClasse(itemValue)}>
          <Picker.Item label="Classe" value="" />
          {classeList.map((classe, index) => (
            <Picker.Item key={index} label={classe} value={classe} />
          ))}
        </Picker>

        <Picker selectedValue={selectedZone} style={styles.picker} onValueChange={(itemValue) => setSelectedZone(itemValue)}>
          <Picker.Item label="Zone" value="" />
          {zoneList.map((zone, index) => (
            <Picker.Item key={index} label={zone} value={zone} />
          ))}
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0A4191" />
      ) : filteredEducators.length > 0 ? (
        filteredEducators.map((educator, index) => (
          <EducatorCard
            key={index}
            npi={educator.npi}
            name={educator.name}
            subject={educator.subject}
            rating={educator.rating}
            zone={educator.zone}
            photo={educator.photo}
          />
        ))
      ) : (
        <Text style={styles.noEducators}>Aucun éducateur trouvé avec ces critères.</Text>
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
    marginRight: 5,
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
