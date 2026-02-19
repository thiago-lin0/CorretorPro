import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../lib/supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface Prova {
  id_prova: number;
  titulo: string;
  criado_em: string;
}

export default function RelatoriosScreen() {
  const router = useRouter();
  const [provas, setProvas] = useState<Prova[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProvas();
  }, []);

  async function fetchProvas() {
    try {
      setLoading(true);
      // Usando as colunas reais da sua imagem: id_prova, titulo, criado_em
      const { data, error } = await supabase
        .from('tb_prova')
        .select('id_prova, titulo, criado_em') 
        .order('criado_em', { ascending: false });

      if (error) throw error;
      if (data) setProvas(data);
    } catch (error: any) {
      console.log("Erro ao carregar provas:", error.message);
      Alert.alert("Erro", "Não foi possível carregar as provas.");
    } finally {
      setLoading(false);
    }
  }

  // 🎯 ABORDAGEM NOVA: Abre o link direto no navegador
  async function baixarRelatorio(id_prova: number) {
    const url = `${API_URL}/relatorio/prova/consolidado/${id_prova}`;
    
    try {
      // Verifica se o celular consegue abrir a URL
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        Alert.alert(
          "Baixar Relatório",
          "O navegador será aberto para processar o download do Excel.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Baixar", onPress: () => Linking.openURL(url) }
          ]
        );
      } else {
        Alert.alert("Erro", "Não foi possível abrir o link de download.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um problema ao tentar baixar o arquivo.");
    }
  }

  const renderItem = ({ item }: { item: Prova }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="file-excel" size={30} color="#10B981" />
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.nomeProva}>{item.titulo}</Text>
          <Text style={styles.detalhesProva}>
            Criado em: {item.criado_em ? new Date(item.criado_em).toLocaleDateString('pt-BR') : '--'}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.botaoDownload}
        onPress={() => baixarRelatorio(item.id_prova)}
      >
        <Ionicons name="open-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.textoBotao}>ABRIR NO NAVEGADOR</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.tela}>
      <View style={styles.topo}>
        <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
          <Ionicons name="arrow-back" size={26} color="#1E3A8A" />
        </TouchableOpacity>
        <Text style={styles.tituloTopo}>Relatórios XLSX</Text>
        <View style={{ width: 30 }} />
      </View>

      {loading ? (
        <View style={styles.centralizado}><ActivityIndicator size="large" color="#1E3A8A" /></View>
      ) : (
        <FlatList
          data={provas}
          keyExtractor={(item) => item.id_prova.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={<Text style={{textAlign:'center', color:'#94A3B8'}}>Nenhuma prova encontrada.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#F8FAFC' },
  topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF', elevation: 2 },
  tituloTopo: { fontSize: 18, fontWeight: 'bold', color: '#1E3A8A' },
  botaoVoltar: { padding: 5 },
  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 20, marginBottom: 15, elevation: 3 },
  cardInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconBox: { width: 45, height: 45, borderRadius: 10, backgroundColor: '#F0F4FF', justifyContent: 'center', alignItems: 'center' },
  nomeProva: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  detalhesProva: { fontSize: 12, color: '#94A3B8', marginTop: 3 },
  botaoDownload: { backgroundColor: '#10B981', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: 10 },
  textoBotao: { color: '#FFF', fontWeight: 'bold' },
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});