import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Nossos módulos isolados
import { RelatorioCard } from '../components/RelatorioCard';
import { useRelatorios } from '../hooks/useRelatorios';

export default function RelatoriosScreen() {
  const router = useRouter();
  
  // Extrai a lógica do Hook
  const { provas, loading, baixarRelatorio } = useRelatorios();

  return (
    <SafeAreaView style={styles.tela}>
      
      {/* HEADER */}
      <View style={styles.topo}>
        <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
          <Ionicons name="arrow-back" size={26} color="#1E3A8A" />
        </TouchableOpacity>
        <Text style={styles.tituloTopo}>Relatórios XLSX</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* LISTAGEM */}
      {loading ? (
        <View style={styles.centralizado}>
          <ActivityIndicator size="large" color="#1E3A8A" />
        </View>
      ) : (
        <FlatList
          data={provas}
          keyExtractor={(item) => item.id_prova.toString()}
          renderItem={({ item }) => (
            <RelatorioCard 
              item={item} 
              onDownload={baixarRelatorio} 
            />
          )}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <Text style={styles.listaVazia}>Nenhuma prova encontrada.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

// Estilos apenas do layout da tela
const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#F8FAFC' },
  topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF', elevation: 2 },
  tituloTopo: { fontSize: 18, fontWeight: 'bold', color: '#1E3A8A' },
  botaoVoltar: { padding: 5 },
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listaVazia: { textAlign: 'center', color: '#94A3B8' }
});