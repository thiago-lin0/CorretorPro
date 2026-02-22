// app/index.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image, // Importado
  Keyboard // Importado
  ,
  KeyboardAvoidingView, // Importado
  Platform, // Importado
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity, // Importado
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const logoImg = require('../assets/images/logo.png');

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Erro no Login', error.message);
      setLoading(false);
    } else {
      setLoading(false);
      router.replace('/home'); 
    }
  }

  return (
    // 1. KeyboardAvoidingView: Ajusta a tela conforme o teclado sobe
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* 2. ScrollView: Permite rolar a tela se o formulário for maior que o espaço disponível */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 3. TouchableWithoutFeedback: Fecha o teclado ao clicar fora de um input */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            
            {/* Cabeçalho / Logo */}
            <View style={styles.header}>
              <Image source={logoImg} style={styles.logo} resizeMode="contain" />
              <Text style={styles.logoText}>AVALIADOR<Text style={styles.logoBold}> 360</Text></Text>
              <Text style={styles.subtitle}>Inteligência de dados para uma educação de resultados.</Text>
            </View>

            {/* Formulário */}
            <View style={styles.form}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="exemplo@escola.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="******"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity 
                style={styles.button} 
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>ENTRAR</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.forgotText}>Esqueci minha senha</Text>
              </TouchableOpacity>

              {/* Link para Cadastro */}
              <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>Não tem uma conta? </Text>
                  <TouchableOpacity onPress={() => router.push('/register')}>
                      <Text style={styles.registerLink}>Cadastre-se</Text>
                  </TouchableOpacity>
              </View>
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
  scrollContainer: {
    flexGrow: 1, // Importante para o ScrollView ocupar todo o espaço
    justifyContent: 'center',
    padding: 20,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: { 
    width: 100, 
    height: 100,
  },
  logoText: {
    fontSize: 32,
    color: '#0070C0', 
    fontWeight: '300',
  },
  logoBold: {
    fontWeight: 'bold',
    color: '#10B981'
  },
  subtitle: {
    fontSize: 10,
    color: '#334155',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 30,
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
    color: '#333',
    borderWidth: 1,
    borderColor: '#E1E4E8',
  },
  button: {
    backgroundColor: '#0070C0', 
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
  forgotButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  forgotText: {
    color: '#666',
    fontSize: 14,
  },
  registerContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 14,
  }
});