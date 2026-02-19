import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from '../lib/supabase';

// Interfaces atualizadas
interface ProvaFiltro {
  id_prova: number;
  titulo: string;
}

interface Correcao {
  id_folha: any;
  nota_final: number | null;
  data_correcao: string | null;
  status: string | null;
  id_prova: number | null;
  tb_aluno: { nome_completo: string; } | null;
  tb_prova: { titulo: string; } | null; // Adicionado para mostrar o nome da prova no card
}

export default function HistoricoScreen() {
  const router = useRouter();
  const [correcoes, setCorrecoes] = useState<Correcao[]>([]);
  const [provasDisponiveis, setProvasDisponiveis] = useState<ProvaFiltro[]>([]);
  const [provaSelecionada, setProvaSelecionada] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 1. Busca os NOMES das provas que possuem registros corrigidos
  const buscarListaDeProvas = async () => {
    try {
      const { data, error } = await supabase
        .from('tb_folha_resposta')
        .select(`
          id_prova,
          tb_prova!id_prova ( nome )
        `)
        .eq('status', 'CORRIGIDA');
      
      if (data) {
        // Remove duplicatas e formata para a lista de chips
        const mapa = new Map();
        data.forEach(item => {
          if (item.id_prova && item.tb_prova) {
            const provaObj = Array.isArray(item.tb_prova) ? item.tb_prova[0] : item.tb_prova;
            mapa.set(item.id_prova, provaObj.nome);
          }
        });

        const listaFormatada: ProvaFiltro[] = Array.from(mapa.entries()).map(([id, titulo]) => ({
          id_prova: id,
          titulo: titulo
        }));

        setProvasDisponiveis(listaFormatada.sort((a, b) => a.titulo.localeCompare(b.titulo)));
      }
    } catch (e) { console.log("Erro ao carregar filtros:", e); }
  };

  // 2. Busca o histórico com os nomes
  const buscarHistorico = async (idProva: number | null = null) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('tb_folha_resposta')
        .select(`
          id_folha, 
          id_prova, 
          nota_final, 
          data_correcao, 
          status,
          tb_aluno!id_aluno ( nome_completo ),
          tb_prova!id_prova ( titulo )
        `)
        .eq('status', 'CORRIGIDA')
        .order('data_correcao', { ascending: false });

      if (idProva) {
        query = query.eq('id_prova', idProva);
      }

      const { data, error } = await query.limit(30);

      if (error) throw error;

      if (data) {
        const formatados = data.map(item => ({
          ...item,
          tb_aluno: Array.isArray(item.tb_aluno) ? item.tb_aluno[0] : item.tb_aluno,
          tb_prova: Array.isArray(item.tb_prova) ? item.tb_prova[0] : item.tb_prova
        }));
        setCorrecoes(formatados);
      }
    } catch (error: any) {
      console.error('Erro:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    buscarListaDeProvas();
    buscarHistorico();
  }, []);

  const selecionarFiltro = (id: number | null) => {
    setProvaSelecionada(id);
    buscarHistorico(id);
  };

  const onRefresh = () => {
    setRefreshing(true);
    buscarListaDeProvas();
    buscarHistorico(provaSelecionada);
  };

  const renderItem = ({ item }: { item: Correcao }) => {
    const nomeAluno = item.tb_aluno?.nome_completo || "Aluno não identificado";
    const nomeProva = item.tb_prova?.titulo || `Prova ${item.id_prova}`;
    const notaExibida = item.nota_final?.toFixed(1) || "0.0";
    const dataObj = item.data_correcao ? new Date(item.data_correcao) : null;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="person" size={22} color="#2B428C" />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.nomeText} numberOfLines={1}>{nomeAluno}</Text>
            <View style={styles.row}>
              <Ionicons name="school-outline" size={12} color="#94A3B8" />
              <Text style={styles.dateText}> {nomeProva} </Text>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.dateText}>{dataObj?.toLocaleDateString('pt-BR')}</Text>
            </View>
          </View>
          <View style={styles.notaContainer}>
            <Text style={styles.notaLabel}>NOTA</Text>
            <Text style={[styles.notaValue, { color: (item.nota_final || 0) >= 6 ? '#15803D' : '#C62828' }]}>
              {notaExibida}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.btnBack}>
          <Ionicons name="arrow-back" size={26} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.title}>Histórico Detalhado</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.btnBack}>
          <Ionicons name="refresh" size={22} color="#2B428C" />
        </TouchableOpacity>
      </View>

      {/* FILTRO DE PROVAS (USANDO NOMES) */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity 
            style={[styles.chip, provaSelecionada === null && styles.chipActive]}
            onPress={() => selecionarFiltro(null)}
          >
            <Text style={[styles.chipText, provaSelecionada === null && styles.chipTextActive]}>Todas as Provas</Text>
          </TouchableOpacity>
          
          {provasDisponiveis.map((prova) => (
            <TouchableOpacity 
              key={prova.id_prova} 
              style={[styles.chip, provaSelecionada === prova.id_prova && styles.chipActive]}
              onPress={() => selecionarFiltro(prova.id_prova)}
            >
              <Text style={[styles.chipText, provaSelecionada === prova.id_prova && styles.chipTextActive]}>
                {prova.titulo}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#2B428C" /></View>
      ) : (
        <FlatList
          data={correcoes}
          keyExtractor={(item, index) => String(item.id_folha || index)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="filter-outline" size={60} color="#CBD5E1" />
              <Text style={styles.emptyText}>Nenhuma nota encontrada para esta prova.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF' },
  btnBack: { padding: 5 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  filterWrapper: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingVertical: 12 },
  filterScroll: { paddingHorizontal: 20 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', marginRight: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  chipActive: { backgroundColor: '#2B428C', borderColor: '#2B428C' },
  chipText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  chipTextActive: { color: '#FFF' },
  list: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 15, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F5F9' },
  infoContainer: { flex: 1, marginLeft: 12 },
  nomeText: { fontSize: 15, fontWeight: '700', color: '#334155' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  dateText: { fontSize: 11, color: '#94A3B8' },
  separator: { marginHorizontal: 5, color: '#CBD5E1', fontSize: 10 },
  notaContainer: { alignItems: 'center', backgroundColor: '#F8FAFC', padding: 8, borderRadius: 12, minWidth: 60 },
  notaLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '800' },
  notaValue: { fontSize: 17, fontWeight: '800' },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { marginTop: 10, color: '#94A3B8', fontSize: 14 }
});