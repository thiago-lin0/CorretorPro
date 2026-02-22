// app/register.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
<<<<<<< HEAD
import {
  ActivityIndicator,
  Alert,
  Image, // Importado
  Keyboard // Importado
  ,
  KeyboardAvoidingView, // Importado
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity, // Importado
  TouchableWithoutFeedback,
  View
} from 'react-native';
=======
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
>>>>>>> 9d1bb21580f701a08ffb24ffc1eab71df7003bd0
import { supabase } from '../lib/supabase';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const logoImg = require('../assets/images/logo.png');

  async function handleRegister() {
<<<<<<< HEAD
=======
    
>>>>>>> 9d1bb21580f701a08ffb24ffc1eab71df7003bd0
    if (!name || !schoolName || !email || !password) {
        return Alert.alert("Atenção", "Por favor, preencha todos os campos.");
    }

    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: name,
          school_name: schoolName, 
          role: 'admin_escola'
        }
      }
    });

    if (error) {
      Alert.alert('Erro ao cadastrar', error.message);
      setLoading(false);
    } else {
      setLoading(false);
      Alert.alert(
        "Conta Criada!", 
        `Bem-vindo(a), ${name}! Sua escola foi registrada.`,
        [{ text: "OK", onPress: () => router.back() }] 
      );
    }
  }

  return (
    // 1. Envolvemos tudo com o KeyboardAvoidingView
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

<<<<<<< HEAD
      {/* 2. ScrollView permite rolar os campos quando o teclado sobe */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 3. Permite fechar o teclado clicando fora dos inputs */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.header}>
              <Image source={logoImg} style={styles.logo} resizeMode="contain" />
              <Text style={styles.title}>Nova Conta</Text>
              <Text style={styles.subtitle}>Cadastre-se para gerenciar suas provas.</Text>
            </View>
=======
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image source={logoImg} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Nova Conta</Text>
          <Text style={styles.subtitle}>Cadastre-se para gerenciar suas provas.</Text>
        </View>
>>>>>>> 9d1bb21580f701a08ffb24ffc1eab71df7003bd0

            <View style={styles.form}>
              <Text style={styles.label}>Seu Nome Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Ana Souza"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />

              <Text style={styles.label}>Nome da Escola</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Colégio Futuro"
                value={schoolName}
                onChangeText={setSchoolName}
                autoCapitalize="words"
              />

              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="diretor@escola.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Crie uma senha forte"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity 
                style={styles.button} 
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>CRIAR CONTA</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
<<<<<<< HEAD
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: { 
=======
    logo: { 
>>>>>>> 9d1bb21580f701a08ffb24ffc1eab71df7003bd0
    width: 100, 
    height: 100,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 80, // Aumentado para dar espaço ao botão de voltar
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: '#FFF', // Adicionado para destacar o botão
    padding: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    color: '#0070C0',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#FFF',
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F0F2F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E1E4E8',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#00B050', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});