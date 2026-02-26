import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HeroCard, SquareCard, WideCard } from '../../components/DashboardCards';
import { useProfessorProfile } from '../../hooks/useProfessorProfile';
import { supabase } from '../../lib/supabase';

export default function HomeScreen() {
  // 1. A lógica pesada ficou toda abstraída no Hook!
  const { professor, loading } = useProfessorProfile();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  const primeiroNome = professor?.nome?.split(' ')[0] || 'Professor';
  const nomeEscola = professor?.tb_escola?.nome || 'Escola não vinculada';

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, Prof. {primeiroNome}</Text>
            <Text style={styles.title}>Painel de Controle</Text>
            <Text style={styles.schoolSub}>🎓 {nomeEscola}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        {/* GRID DE BOTÕES */}
        <View style={styles.gridContainer}>
          <SquareCard 
            title="Turmas & Alunos" 
            bgColor="#E3F2FD" 
            icon={<Ionicons name="people" size={28} color="#2196F3" />} 
            onPress={() => router.push('/turmaEAlunos')} 
          />
          <SquareCard 
            title="Minhas Provas" 
            bgColor="#F3E5F5" 
            icon={<Ionicons name="grid" size={28} color="#9C27B0" />} 
            onPress={() => router.push('/novo-gabarito')} 
          />
        </View>

        {/* CARD DA CÂMERA */}
        <HeroCard 
          title="Ler Gabaritos" 
          subtitle="Corrigir via Câmera" 
          iconName="camera" 
          onPress={() => router.push('/escanear-gabarito')} 
        />

        {/* LISTA DE OPÇÕES (Cards Largos) */}
        <WideCard 
          title="Histórico de Correções" 
          subtitle="Últimas provas digitalizadas" 
          bgColor="#E8EAF6" 
          icon={<Ionicons name="time" size={24} color="#3F51B5" />} 
          onPress={() => router.push('/historico')} 
          style={{ marginBottom: 15 }}
        />

        <WideCard 
          title="Relatórios XLSX" 
          subtitle="Consolidados e Gráficos" 
          bgColor="#E8F5E9" 
          icon={<MaterialCommunityIcons name="file-excel" size={24} color="#4CAF50" />} 
          onPress={() => router.push('/relatorios')} 
        />

      </ScrollView>
    </SafeAreaView>
  );
}

// Apenas estilos estruturais da tela principal
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 24, paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30 },
  greeting: { fontSize: 15, color: '#888', fontWeight: '500' },
  title: { fontSize: 26, color: '#003399', fontWeight: '800' },
  schoolSub: { fontSize: 13, color: '#10B981', fontWeight: '700', marginTop: 4 },
  logoutButton: { backgroundColor: '#FFF', padding: 10, borderRadius: 50, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
});