import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

export default function DetailsEnfant() {
  const router = useRouter();
  const { NPI_enfant } = useLocalSearchParams(); // Récupération du paramètre depuis la navigation

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const [loading, setLoading] = useState(true);
  const [enfant, setEnfant] = useState(null);
  const [formData, setFormData] = useState({
    NPI: '',
    Nom_enfant: '',
    Prenom_enfant: '',
    Date_naissance: '',
    Sexe_enfant: '',
    Parent_tuteur: '',
    Ecole_actuelle: '',
    Classe_actuelle: '',
  });

  useEffect(() => {
    const fetchEnfantDetails = async () => {
      try {
        const response = await fetch(`https://access-backend-a961a1f4abb2.herokuapp.com/api/get_enfant/${NPI_enfant}`);
        const data = await response.json();

        if (response.ok) {
          setEnfant(data);
          setFormData({
            NPI: data.NPI,
            Nom_enfant: data.Nom_enfant,
            Prenom_enfant: data.Prenom_enfant,
            Date_naissance: data.Date_naissance,
            Sexe_enfant: data.Sexe_enfant,
            Parent_tuteur: data.Parent_tuteur,
            Ecole_actuelle: data.Ecole_actuelle,
            Classe_actuelle: data.Classe_actuelle,
          });
        } else {
          console.error('Erreur API:', data.error);
        }
      } catch (error) {
        console.error('Erreur de récupération:', error);
      } finally {
        setLoading(false);
      }
    };

    if (NPI_enfant) {
      fetchEnfantDetails();
    }
  }, [NPI_enfant]);

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0a4191" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Détails de l'enfant</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Quelques informations</Text>
        <View style={styles.form}>
          <TextInput style={styles.input} value={formData.NPI} editable={false} />
          <TextInput style={styles.input} value={formData.Nom_enfant} onChangeText={(text) => handleChange('Nom_enfant', text)} />
          <TextInput style={styles.input} value={formData.Prenom_enfant} onChangeText={(text) => handleChange('Prenom_enfant', text)} />
          <TextInput style={styles.input} value={formData.Date_naissance} editable={false} />
          <TextInput style={styles.input} value={formData.Sexe_enfant} editable={false} />
          <TextInput style={styles.input} value={formData.Parent_tuteur} onChangeText={(text) => handleChange('Parent_tuteur', text)} />
          <TextInput style={styles.input} value={formData.Ecole_actuelle} onChangeText={(text) => handleChange('Ecole_actuelle', text)} />
          <TextInput style={styles.input} value={formData.Classe_actuelle} onChangeText={(text) => handleChange('Classe_actuelle', text)} />

          <TouchableOpacity style={styles.button} onPress={() => router.push('/EnfantsFolder/ListEnfants')}>
            <Text style={styles.buttonText}>Enregistrer</Text>
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
  formContainer: {
    marginTop: 24,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282828',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Montserrat_700Bold',
  },
  form: {
    gap: 5,
  },
  input: {
    height: 40,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#282828',
    marginBottom: 5,
    fontFamily: 'Montserrat_400Regular',
  },
  button: {
    height: 45,
    backgroundColor: '#0a4191',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 0,
  },
  buttonText: {
    color: '#F3F1FF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Montserrat_700Bold',
  },
});
