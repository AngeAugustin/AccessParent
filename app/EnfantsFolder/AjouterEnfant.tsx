import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import * as SecureStore from 'expo-secure-store';

export default function AjouterEnfant() {
  const router = useRouter();

  interface FormData {
    NPI_enfant: string;
    Nom_enfant: string;
    Prenom_enfant: string;
    Date_naissance: string;
    Sexe_enfant: string;
    Classe_actuelle: string;
    Classe_precedente: string;
    Ecole_actuelle: string;
    Ecole_precedente: string;
    Parent_tuteur: string;
    Matieres_preferes: string;
    Centre_interet: string;
    Niveau_francais: string;
    Niveau_anglais: string;
    Niveau_philosophie: string;
    Niveau_svt: string;
    Niveau_pct: string;
    Niveau_mathematique: string;
    Niveau_histgeo: string;
    Niveau_allemand: string;
    Niveau_espagnol: string;
  }

  const [formData, setFormData] = useState<FormData>({
    NPI_enfant: '',
    Nom_enfant: '',
    Prenom_enfant: '',
    Date_naissance: '',
    Sexe_enfant: '',
    Classe_actuelle: '',
    Classe_precedente: '',
    Ecole_actuelle: '',
    Ecole_precedente: '',
    Parent_tuteur: '',
    Matieres_preferes: '',
    Centre_interet: '',
    Niveau_allemand: '',
    Niveau_anglais: '',
    Niveau_espagnol: '',
    Niveau_francais: '',
    Niveau_histgeo: '',
    Niveau_mathematique: '',
    Niveau_pct: '',
    Niveau_philosophie: '',
    Niveau_svt: '',
  });

  const handleInputChange = (name: keyof FormData, value: string): void => {
    setFormData({ ...formData, [name]: value });
  };

  const [error, setError] = useState('');
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const [user, setUser] = useState({ NPI: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await SecureStore.getItemAsync('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser({
            NPI: parsedUser.NPI || '',
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur', error);
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    if (
      !formData.NPI_enfant ||
      !formData.Nom_enfant ||
      !formData.Prenom_enfant ||
      !formData.Sexe_enfant ||
      !formData.Date_naissance ||
      !formData.Classe_actuelle ||
      !formData.Classe_precedente ||
      !formData.Ecole_actuelle ||
      !formData.Ecole_precedente ||
      !formData.Niveau_allemand ||
      !formData.Niveau_anglais ||
      !formData.Niveau_espagnol ||
      !formData.Niveau_francais ||
      !formData.Niveau_histgeo ||
      !formData.Niveau_mathematique ||
      !formData.Niveau_pct ||
      !formData.Niveau_philosophie ||
      !formData.Niveau_svt ||
      !formData.Matieres_preferes ||
      !formData.Parent_tuteur ||
      !formData.Centre_interet
    ) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      const formattedDate = new Date(formData.Date_naissance).toISOString();

      const response = await fetch(
        'https://mediumvioletred-mole-607585.hostingersite.com/public/api/add_enfant',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            NPI: user.NPI,
            ...formData,
            Date_naissance: formattedDate,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        router.push('/EnfantsFolder/ListEnfants');
      } else {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          setError(errorMessages);
        } else {
          setError(data.error || 'Une erreur s\'est produite');
        }
      }
    } catch (error) {
      setError('Erreur de connexion avec le serveur');
    }
  };

  const [currentForm, setCurrentForm] = useState(1);

  const classes = [
    '6ème', '5ème', '4ème ML', '4ème MC', '3ème ML', '3ème MC',
    '2nde AB', '2nde CD', '1ère AB', '1ère C', '1ère D',
    'Tle AB', 'Tle C', 'Tle D'
  ];

  const renderForm = () => {
    switch (currentForm) {
      case 1:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Profil personnel</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                value={formData.NPI_enfant}
                onChangeText={(text) => handleInputChange('NPI_enfant', text)}
                placeholder="NPI de l'enfant"
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Noms de l'enfant"
                value={formData.Nom_enfant}
                onChangeText={(text) => handleInputChange('Nom_enfant', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Prénoms de l'enfant"
                value={formData.Prenom_enfant}
                onChangeText={(text) => handleInputChange('Prenom_enfant', text)}
              />
              <TextInput
                style={styles.input}
                value={formData.Date_naissance}
                onChangeText={(text) => handleInputChange('Date_naissance', text)}
                placeholder="Date de naissance"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                value={formData.Sexe_enfant}
                onChangeText={(text) => handleInputChange('Sexe_enfant', text)}
                placeholder="Sexe (M/F)"
              />

              {/* Classe actuelle Picker */}
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.Classe_actuelle}
                  onValueChange={(itemValue) => handleInputChange('Classe_actuelle', itemValue)}
                >
                  <Picker.Item label="Sélectionner une classe actuelle" value="" color="#7F7F7F" />
                  {classes.map((classe, index) => (
                    <Picker.Item key={index} label={classe} value={classe} />
                  ))}
                </Picker>
              </View>

              <TextInput
                style={styles.input}
                value={formData.Ecole_actuelle}
                onChangeText={(text) => handleInputChange('Ecole_actuelle', text)}
                placeholder="Ecole actuelle"
              />

              <TouchableOpacity
                style={styles.button}
                onPress={() => setCurrentForm(2)}
              >
                <Text style={styles.buttonText}>Passer au suivant</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Profil psychologique</Text>
            <View style={styles.form}>
              {error && <Text style={styles.errorText}>{error}</Text>}
              <TextInput
                style={styles.input}
                placeholder="Parent ou Tuteur ?"
                value={formData.Parent_tuteur}
                onChangeText={(text) => handleInputChange('Parent_tuteur', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Quelles matières préfères-tu et pourquoi ?"
                value={formData.Matieres_preferes}
                onChangeText={(text) => handleInputChange('Matieres_preferes', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Centres d'intérêt"
                value={formData.Centre_interet}
                onChangeText={(text) => handleInputChange('Centre_interet', text)}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => setCurrentForm(1)}
              >
                <Text style={styles.buttonText}>Revenir au précédent</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setCurrentForm(3)}
              >
                <Text style={styles.buttonText}>Passer au suivant</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Parcours scolaire récent</Text>
            <View style={styles.scrollContainer}>
              <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                <View style={styles.form}>
                  {error && <Text style={styles.errorText}>{error}</Text>}
                  
                  {/* Classe précédente Picker */}
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={formData.Classe_precedente}
                      onValueChange={(itemValue) => handleInputChange('Classe_precedente', itemValue)}
                    >
                      <Picker.Item label="Sélectionner une classe précédente" value="" color="#7F7F7F" />
                      {classes.map((classe, index) => (
                        <Picker.Item key={index} label={classe} value={classe} />
                      ))}
                    </Picker>
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Ecole précédente"
                    value={formData.Ecole_precedente}
                    onChangeText={(text) => handleInputChange('Ecole_precedente', text)}
                  />

                  {/* Niveaux */}
                  <TextInput style={styles.input} placeholder="Niveau en Français" value={formData.Niveau_francais} onChangeText={(text) => handleInputChange('Niveau_francais', text)} keyboardType="phone-pad" />
                  <TextInput style={styles.input} placeholder="Niveau en PCT" value={formData.Niveau_pct} onChangeText={(text) => handleInputChange('Niveau_pct', text)} keyboardType="phone-pad" />
                  <TextInput style={styles.input} placeholder="Niveau en Mathématique" value={formData.Niveau_mathematique} onChangeText={(text) => handleInputChange('Niveau_mathematique', text)} keyboardType="phone-pad" />
                  <TextInput style={styles.input} placeholder="Niveau en SVT" value={formData.Niveau_svt} onChangeText={(text) => handleInputChange('Niveau_svt', text)} keyboardType="phone-pad" />
                  <TextInput style={styles.input} placeholder="Niveau en Anglais" value={formData.Niveau_anglais} onChangeText={(text) => handleInputChange('Niveau_anglais', text)} keyboardType="phone-pad" />
                  <TextInput style={styles.input} placeholder="Niveau en Histoire et Géographie" value={formData.Niveau_histgeo} onChangeText={(text) => handleInputChange('Niveau_histgeo', text)} keyboardType="phone-pad" />
                  <TextInput style={styles.input} placeholder="Niveau en Philosophie" value={formData.Niveau_philosophie} onChangeText={(text) => handleInputChange('Niveau_philosophie', text)} keyboardType="phone-pad" />
                  <TextInput style={styles.input} placeholder="Niveau en Allemand" value={formData.Niveau_allemand} onChangeText={(text) => handleInputChange('Niveau_allemand', text)} keyboardType="phone-pad" />
                  <TextInput style={styles.input} placeholder="Niveau en Espagnol" value={formData.Niveau_espagnol} onChangeText={(text) => handleInputChange('Niveau_espagnol', text)} keyboardType="phone-pad" />
                </View>
              </ScrollView>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => setCurrentForm(2)}>
              <Text style={styles.buttonText}>Revenir au précédent</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Finaliser</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Ajouter enfant</Text>
          <Text style={styles.subtitle}>Remplir les champs suivants</Text>
        </View>
      </View>
      {renderForm()}
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
    width: '100%',
    gap: 5,
  },
  scrollContainer: {
    height: 300,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  scrollView: {
    maxHeight: 400,
    marginBottom: 5,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 15,
    marginBottom: 5,
    overflow: 'hidden',
  },
  button: {
    height: 45,
    backgroundColor: '#0a4191',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#F3F1FF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Montserrat_700Bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    textAlign: 'center',
  },
});
