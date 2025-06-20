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
    Niveau_economie: string;
    Niveau_comptabilite: string;
    Niveau_comptagenerale: string;
    Niveau_comptaanalytique: string;
    Niveau_comptasociete: string;
    Niveau_comptausuelle: string;
    Niveau_TA: string;
    Niveau_mathsfinanciere: string;
    Niveau_droit: string;
    Niveau_mathsgenerale: string;
    Niveau_fiscalite: string;
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
    Niveau_economie: '',
    Niveau_comptabilite: '',
    Niveau_comptagenerale: '',
    Niveau_comptaanalytique: '',
    Niveau_comptasociete: '',
    Niveau_comptausuelle: '',
    Niveau_TA: '',
    Niveau_mathsfinanciere: '',
    Niveau_droit: '',
    Niveau_mathsgenerale: '',
    Niveau_fiscalite: '',
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

  const [currentForm, setCurrentForm] = useState(1);

  const classes = [
    '6ème', '5ème', '4ème ML', '4ème MC', '3ème ML', '3ème MC',
    '2nde AB', '2nde CD', '2nde G2', '1ère AB', '1ère C', '1ère D', '1ère G2',
    'Tle AB', 'Tle C', 'Tle D', 'Tle G2'
  ];

  // Fonction pour obtenir les matières selon la classe
  const getMatieresByClasse = (classe: string) => {
    const collegeClasses = ['6ème', '5ème', '4ème ML', '4ème MC', '3ème ML', '3ème MC'];
    const abClasses = ['2nde AB', '1ère AB', 'Tle AB'];
    const cdClasses = ['2nde CD', '1ère C', '1ère D', 'Tle C', 'Tle D'];

    if (collegeClasses.includes(classe)) {
      return [
        { key: 'Niveau_francais', label: 'Niveau en Français' },
        { key: 'Niveau_mathematique', label: 'Niveau en Mathématiques' },
        { key: 'Niveau_anglais', label: 'Niveau en Anglais' },
        { key: 'Niveau_svt', label: 'Niveau en SVT' },
        { key: 'Niveau_pct', label: 'Niveau en PCT' },
        { key: 'Niveau_histgeo', label: 'Niveau en Histoire-Géographie' },
        { key: 'Niveau_allemand', label: 'Niveau en Allemand' },
        { key: 'Niveau_espagnol', label: 'Niveau en Espagnol' }
      ];
    } else if (abClasses.includes(classe)) {
      return [
        { key: 'Niveau_francais', label: 'Niveau en Français' },
        { key: 'Niveau_anglais', label: 'Niveau en Anglais' },
        { key: 'Niveau_svt', label: 'Niveau en SVT' },
        { key: 'Niveau_philosophie', label: 'Niveau en Philosophie' },
        { key: 'Niveau_mathematique', label: 'Niveau en Mathématiques' },
        { key: 'Niveau_allemand', label: 'Niveau en Allemand' },
        { key: 'Niveau_espagnol', label: 'Niveau en Espagnol' },
        { key: 'Niveau_histgeo', label: 'Niveau en Histoire-Géographie' }
      ];
    } else if (classe === '2nde G2') {
      return [
        { key: 'Niveau_francais', label: 'Niveau en Français' },
        { key: 'Niveau_anglais', label: 'Niveau en Anglais' },
        { key: 'Niveau_economie', label: 'Niveau en Économie' },
        { key: 'Niveau_comptabilite', label: 'Niveau en Comptabilité' },
        { key: 'Niveau_TA', label: 'Niveau en TA' },
        { key: 'Niveau_mathsfinanciere', label: 'Niveau en Mathématiques Financières' },
        { key: 'Niveau_droit', label: 'Niveau en Droit' },
        { key: 'Niveau_mathsgenerale', label: 'Niveau en Mathématiques Générales' }
      ];
    } else if (classe === '1ère G2') {
      return [
        { key: 'Niveau_anglais', label: 'Niveau en Anglais' },
        { key: 'Niveau_francais', label: 'Niveau en Français' },
        { key: 'Niveau_TA', label: 'Niveau en TA' },
        { key: 'Niveau_comptagenerale', label: 'Niveau en Comptabilité Générale' },
        { key: 'Niveau_comptausuelle', label: 'Niveau en Comptabilité Usuelle' },
        { key: 'Niveau_mathsgenerale', label: 'Niveau en Mathématiques Générales' },
        { key: 'Niveau_mathsfinanciere', label: 'Niveau en Mathématiques Financières' },
        { key: 'Niveau_economie', label: 'Niveau en Économie' },
        { key: 'Niveau_droit', label: 'Niveau en Droit' }
      ];
    } else if (classe === 'Tle G2') {
      return [
        { key: 'Niveau_francais', label: 'Niveau en Français' },
        { key: 'Niveau_anglais', label: 'Niveau en Anglais' },
        { key: 'Niveau_droit', label: 'Niveau en Droit' },
        { key: 'Niveau_economie', label: 'Niveau en Économie' },
        { key: 'Niveau_comptasociete', label: 'Niveau en Comptabilité des Sociétés' },
        { key: 'Niveau_comptaanalytique', label: 'Niveau en Comptabilité Analytique' },
        { key: 'Niveau_fiscalite', label: 'Niveau en Fiscalité' },
        { key: 'Niveau_mathsfinanciere', label: 'Niveau en Mathématiques Financières' },
        { key: 'Niveau_mathsgenerale', label: 'Niveau en Mathématiques Générales' },
        { key: 'Niveau_philosophie', label: 'Niveau en Philosophie' }
      ];
    } else if (cdClasses.includes(classe)) {
      return [
        { key: 'Niveau_francais', label: 'Niveau en Français' },
        { key: 'Niveau_anglais', label: 'Niveau en Anglais' },
        { key: 'Niveau_pct', label: 'Niveau en PCT' },
        { key: 'Niveau_svt', label: 'Niveau en SVT' },
        { key: 'Niveau_histgeo', label: 'Niveau en Histoire-Géographie' },
        { key: 'Niveau_philosophie', label: 'Niveau en Philosophie' },
        { key: 'Niveau_mathematique', label: 'Niveau en Mathématiques' }
      ];
    }
    return [];
  };

  // Fonction pour vérifier si tous les champs requis sont remplis
  const validateRequiredFields = () => {
    // Champs de base toujours requis
    const baseFields = [
      'NPI_enfant', 'Nom_enfant', 'Prenom_enfant', 'Sexe_enfant', 'Date_naissance',
      'Classe_actuelle', 'Classe_precedente', 'Ecole_actuelle', 'Ecole_precedente',
      'Matieres_preferes', 'Parent_tuteur', 'Centre_interet'
    ];

    // Vérifier les champs de base
    for (const field of baseFields) {
      if (!formData[field as keyof FormData]) {
        return false;
      }
    }

    // Vérifier les matières selon la classe actuelle
    const matieres = getMatieresByClasse(formData.Classe_actuelle);
    for (const matiere of matieres) {
      if (!formData[matiere.key as keyof FormData]) {
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateRequiredFields()) {
      setError('Veuillez remplir tous les champs requis');
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
                placeholder="Date de naissance (YYYY-MM-DD)"
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
        const matieres = getMatieresByClasse(formData.Classe_actuelle);
        
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

                  {/* Affichage conditionnel des matières selon la classe actuelle */}
                  {formData.Classe_actuelle ? (
                    <>
                      <Text style={styles.sectionTitle}>
                        Niveaux pour la classe {formData.Classe_actuelle}
                      </Text>
                      {matieres.map((matiere, index) => (
                        <TextInput
                          key={index}
                          style={styles.input}
                          placeholder={matiere.label}
                          value={formData[matiere.key as keyof FormData]}
                          onChangeText={(text) => handleInputChange(matiere.key as keyof FormData, text)}
                          keyboardType="phone-pad"
                        />
                      ))}
                    </>
                  ) : (
                    <Text style={styles.infoText}>
                      Veuillez d'abord sélectionner une classe actuelle pour afficher les matières correspondantes.
                    </Text>
                  )}
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0a4191',
    marginBottom: 10,
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'Montserrat_700Bold',
  },
  infoText: {
    fontSize: 12,
    color: '#7F7F7F',
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 20,
    fontFamily: 'Montserrat_400Regular',
  },
});