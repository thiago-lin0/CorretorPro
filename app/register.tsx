import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

// Imports da nossa arquitetura
import { AuthInput } from '../components/AuthInput';
import { useRegister } from '../hooks/useRegister';

export default function RegisterScreen() {
  const {
    name, setName, schoolName, setSchoolName,
    email, setEmail, password, setPassword,
    loading, handleRegister
  } = useRegister();

  const logoImg = require('../assets/images/logo.png');

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          
          {/* BOTÃO VOLTAR */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <View style={styles.header}>
              <Image source={logoImg} style={styles.logo} resizeMode="contain" />
              <Text style={styles.title}>Nova Conta</Text>
              <Text style={styles.subtitle}>Cadastre-se para gerenciar suas provas.</Text>
            </View>

            <View style={styles.form}>
              
              {/* UTILIZANDO O COMPONENTE REUTILIZÁVEL */}
              <AuthInput
                label="Seu Nome Completo"
                placeholder="Ex: Ana Souza"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />

              <AuthInput
                label="Nome da Escola"
                placeholder="Ex: Colégio Futuro"
                value={schoolName}
                onChangeText={setSchoolName}
                autoCapitalize="words"
              />

              <AuthInput
                label="E-mail"
                placeholder="diretor@escola.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <AuthInput
                label="Senha"
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

          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// Estilos apenas para a estrutura da página
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  logo: { width: 100, height: 100 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20, paddingTop: 100, paddingBottom: 40 },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, backgroundColor: '#FFF', padding: 8, borderRadius: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, color: '#0070C0', fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 5, textAlign: 'center' },
  form: { backgroundColor: '#FFF', padding: 25, borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  button: { backgroundColor: '#00B050', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 25 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});