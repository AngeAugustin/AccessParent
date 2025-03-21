import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts } from 'expo-font';   
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

type Educateur = {
  Name: string;
  Firstname: string;
  Matiere: string;
  Etoiles: number;
  Experience: string;
  Parcours: string;
  Adresse: string;
  avatar?: string;
};

export default function DetailsEducateur() {
  const router = useRouter();
  const { npi } = useLocalSearchParams();
  const [details, setDetails] = useState<Educateur | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://access-backend-a961a1f4abb2.herokuapp.com/api/get_educateur/${npi}`)
      .then((res) => res.json())
      .then((data: Educateur) => {
        setDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [npi]);

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold, 
  });

  if (loading) {
    return <ActivityIndicator size="large" color="#0a4191" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (!details) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Impossible de charger les informations.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Détails de l'éducateur</Text>
          <Text style={styles.subtitle}>Quelques informations</Text>
        </View>
      </View> 

      {/* Avatar et informations utilisateur */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity style={styles.avatarWrapper}>
          <Image source={{ uri: details.avatar || 'https://i.postimg.cc/k4MRhY0L/El-ve.png' }} style={styles.avatar} />
        </TouchableOpacity>
        <Text style={styles.nameText}><Text style={styles.boldText}>{details.Firstname} {details.Name}</Text></Text>
        <Text style={styles.professionText}>Enseignant de {details.Matiere}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(Math.floor(details.Etoiles || 0))].map((_, index) => (
            <Text key={index} style={styles.star}>★</Text>
          ))}
          <Text style={styles.ratingText}> {details.Etoiles}</Text>
        </View>
      </View>

      {/* Informations utilisateur en lecture seule */}
      <View style={styles.formContainer}>
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>

          <Text style={styles.label}>Expérience</Text>
          <View style={styles.inputReadonly}><Text style={styles.inputText}>{details.Experience} ans</Text></View>

          <Text style={styles.label}>Parcours</Text>
          <View style={styles.inputReadonly}><Text style={styles.inputText}>{details.Parcours}</Text></View>

          <Text style={styles.label}>Adresse</Text>
          <View style={styles.inputReadonly}><Text style={styles.inputText}>{details.Adresse}</Text></View>
        </ScrollView>
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
  avatarContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#0a4191',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  nameText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#282828',
  },
  boldText: {
    fontWeight: 'bold',
  },
  professionText: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: '#7F7F7F',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  star: {
    color: '#FFD700',
    fontSize: 14,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: '#282828',
  },
  formContainer: {
    marginTop: 10,
    flex: 1,
  },
  form: {
    flexGrow: 1,
    gap: 5,
  },
  label: {
    fontSize: 12,
    color: '#7F7F7F',
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 5,
  },
  inputReadonly: {
    height: 45,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    marginBottom: 15,
  },
  inputText: {
    fontSize: 12,
    color: '#282828',
    fontFamily: 'Montserrat_400Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
  },
});
