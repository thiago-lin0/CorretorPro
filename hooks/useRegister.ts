import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export function useRegister() {
  const [name, setName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name || !schoolName || !email || !password) {
      return Alert.alert("Atenção", "Por favor, preencha todos os campos.");
    }

    setLoading(true);
    
    // Cadastro no Supabase Auth com metadados
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

  return {
    name, setName,
    schoolName, setSchoolName,
    email, setEmail,
    password, setPassword,
    loading, handleRegister
  };
}