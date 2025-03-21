import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

export default function FinaliserAccomp() {
  const router = useRouter();
 
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const [selectedDuree, setSelectedDuree] = useState('');
  const dureeList = ['1 mois', '2 mois', '3 mois', '4 mois', '5 mois', '6 mois'];

  const [selectedJour, setSelectedJour] = useState('');
  const jourList = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const [selectedHeure, setSelectedHeure] = useState('');
  const heureList = ['08H-10H', '10H-12H', '12H-14H', '14H-16H'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Ajouter accompagnateur</Text>
          <Text style={styles.subtitle}>Assigner l'accompagnateur</Text>
        </View>
      </View>

      <View style={styles.avatarContainer}>
        <TouchableOpacity style={styles.avatarWrapper}>
          <Image source={{ uri: 'https://i.postimg.cc/k4MRhY0L/El-ve.png' }} style={styles.avatar} />
        </TouchableOpacity>
        <Text style={styles.nameText}><Text style={styles.boldText}>Kola Saro</Text></Text>
        <Text style={styles.professionText}>Etudiant</Text>
        <View style={styles.ratingContainer}>
          {[...Array(4)].map((_, index) => (
            <Text key={index} style={styles.star}>★</Text>
          ))}
          <Text style={styles.ratingText}> 4,2</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Compléter les informations</Text>

        <View style={styles.form}>

          <Picker
            selectedValue={selectedDuree}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedDuree(itemValue)}
          >
            <Picker.Item label="Durée du suivi" value="" />
            {dureeList.map((duree, index) => (
              <Picker.Item key={index} label={duree} value={duree} />
            ))}
          </Picker>

          <Picker
            selectedValue={selectedJour}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedJour(itemValue)}
          >
            <Picker.Item label="Jour de suivi" value="" />
            {jourList.map((jour, index) => (
              <Picker.Item key={index} label={jour} value={jour} />
            ))}
          </Picker>

          <Picker
            selectedValue={selectedHeure}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedHeure(itemValue)}
          >
            <Picker.Item label="Heure de suivi" value="" />
            {heureList.map((heure, index) => (
              <Picker.Item key={index} label={heure} value={heure} />
            ))}
          </Picker>

          <TouchableOpacity style={styles.button} onPress={() => router.push('/AccompsFolder/Accompagnateurs')}>
            <Text style={styles.buttonText}>Assigner</Text>
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
    padding: 15 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#282828', 
    fontFamily: 'Montserrat_700Bold' 
  },
  subtitle: { 
    fontSize: 12, 
    color: '#7F7F7F', 
    textAlign: 'left', 
    fontFamily: 'Montserrat_400Regular', 
    marginTop: 5 
  },
  avatarContainer: { 
    alignItems: 'center', 
    marginTop: 20 
  },
  avatarWrapper: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    borderColor: '#0a4191', 
    borderWidth: 2, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#e0e0e0' 
  },
  avatar: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 50 
  },
  formContainer: { 
    marginTop: 15 
  },
  formTitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#282828', 
    textAlign: 'center', 
    marginBottom: 20, 
    fontFamily: 'Montserrat_700Bold' 
  },
  form: { 
    width: '100%', 
    gap: 10 
  },
  picker: { 
    height: 50, 
    borderColor: '#D1D5DB', 
    borderWidth: 1, 
    borderRadius: 15, 
    paddingHorizontal: 12, 
    marginBottom: 5, 
    fontFamily: 'Montserrat_400Regular', 
    fontSize: 12,
    color: '#282828',
  },
  input: { 
    height: 45, 
    borderColor: '#D1D5DB', 
    borderWidth: 1, 
    borderRadius: 15, 
    paddingHorizontal: 12, 
    fontSize: 12, 
    color: '#282828', 
    marginBottom: 5, 
    fontFamily: 'Montserrat_400Regular' 
  },
  button: { 
    height: 45, 
    backgroundColor: '#0a4191', 
    paddingVertical: 15, 
    borderRadius: 15, 
    alignItems: 'center', 
    marginBottom: 16 
  },
  buttonText: { 
    color: '#F3F1FF',  
    fontSize: 12, 
    fontWeight: '500', 
    fontFamily: 'Montserrat_700Bold' 
  },
  nameText: { 
    marginTop: 10, 
    fontSize: 14, 
    fontFamily: 'Montserrat_700Bold', 
    color: '#282828' 
  },
  boldText: { 
    fontWeight: 'bold' 
  },
  professionText: { 
    fontSize: 12, 
    fontFamily: 'Montserrat_400Regular', 
    color: '#7F7F7F' 
  },
  ratingContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 5 
  },
  star: { 
    color: '#FFD700', 
    fontSize: 14 
  },
  ratingText: { 
    fontSize: 12, 
    fontFamily: 'Montserrat_400Regular', 
    color: '#282828' 
  },
});