import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function HistoricoScreen() {
    const router = useRouter();
    const [correcoes, setCorrecoes] = useState<any[]>([]);
    const [provasDisponiveis, setProvasDisponiveis] = useState<any[]>([]);
    const [provaSelecionada, setProvaSelecionada] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const carregarTudo = async (idProva: number | null = null) => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            
            // CONVERSÃO IMPORTANTE: Garante que o ID seja tratado como número
            const escolaId = Number(user?.user_metadata?.id_escola);

            if (!escolaId) {
                setLoading(false);
                return;
            }

            // 1. Busca filtros
            const { data: f } = await supabase
                .from('tb_folha_resposta')
                .select(`id_prova, tb_prova!id_prova!inner ( titulo, id_escola )`)
                .eq('tb_prova.id_escola', escolaId)
                .eq('status', 'CORRIGIDA');

            if (f) {
                const mapa = new Map();
                f.forEach((item: any) => mapa.set(item.id_prova, item.tb_prova.titulo));
                setProvasDisponiveis(Array.from(mapa.entries()).map(([id, t]) => ({ id_prova: id, titulo: t })));
            }

            // 2. Busca histórico
            let query = supabase
                .from('tb_folha_resposta')
                .select(`
                    id_folha, nota_final, data_correcao,
                    tb_aluno!id_aluno ( nome_completo ),
                    tb_prova!id_prova!inner ( titulo, id_escola )
                `)
                .eq('tb_prova.id_escola', escolaId)
                .eq('status', 'CORRIGIDA')
                .order('data_correcao', { ascending: false });

            if (idProva) query = query.eq('id_prova', idProva);

            const { data, error } = await query;
            if (data) setCorrecoes(data);
            if (error) console.log("Erro na busca:", error.message);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { carregarTudo(); }, []);

    const renderItem = ({ item }: any) => {
        const nome = item.tb_aluno?.nome_completo || "Aluno";
        const nota = item.nota_final || 0;
        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.avatar}><Text style={styles.avatarTxt}>{nome.charAt(0)}</Text></View>
                    <View style={styles.content}>
                        <Text style={styles.nome}>{nome}</Text>
                        <Text style={styles.prova}>{item.tb_prova?.titulo}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: nota >= 6 ? '#DCFCE7' : '#FEE2E2' }]}>
                        <Text style={[styles.badgeTxt, { color: nota >= 6 ? '#166534' : '#991B1B' }]}>{nota.toFixed(1)}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><Ionicons name="chevron-back" size={26} color="#1E293B" /></TouchableOpacity>
                    <Text style={styles.title}>Histórico Unidade</Text>
                    <TouchableOpacity onPress={() => carregarTudo(provaSelecionada)} style={styles.backBtn}><Ionicons name="sync" size={22} color="#2B428C" /></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
                    <TouchableOpacity style={[styles.chip, provaSelecionada === null && styles.chipActive]} onPress={() => { setProvaSelecionada(null); carregarTudo(null); }}>
                        <Text style={[styles.chipText, provaSelecionada === null && styles.chipTextActive]}>Todas</Text>
                    </TouchableOpacity>
                    {provasDisponiveis.map((p) => (
                        <TouchableOpacity key={p.id_prova} style={[styles.chip, provaSelecionada === p.id_prova && styles.chipActive]} onPress={() => { setProvaSelecionada(p.id_prova); carregarTudo(p.id_prova); }}>
                            <Text style={[styles.chipText, provaSelecionada === p.id_prova && styles.chipTextActive]}>{p.titulo}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            {loading && !refreshing ? (
                <View style={styles.center}><ActivityIndicator size="large" color="#2B428C" /></View>
            ) : (
                <FlatList 
                    data={correcoes} 
                    keyExtractor={(item) => String(item.id_folha)} 
                    renderItem={renderItem} 
                    contentContainerStyle={styles.list} 
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => carregarTudo(provaSelecionada)} />} 
                    ListEmptyComponent={<View style={styles.empty}><Ionicons name="school-outline" size={60} color="#E2E8F0" /><Text style={styles.emptyTxt}>Nenhum registro para a escola {provaSelecionada}.</Text></View>}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingBottom: 10 },
    headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10, marginBottom: 15 },
    title: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
    backBtn: { padding: 8, backgroundColor: '#F1F5F9', borderRadius: 12 },
    filterBar: { paddingHorizontal: 16 },
    chip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25, backgroundColor: '#F1F5F9', marginRight: 10, borderWidth: 1, borderColor: '#E2E8F0' },
    chipActive: { backgroundColor: '#2B428C', borderColor: '#2B428C' },
    chipText: { fontSize: 14, color: '#64748B', fontWeight: '700' },
    chipTextActive: { color: '#FFF' },
    list: { padding: 16, paddingBottom: 50 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 50, height: 50, borderRadius: 16, backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center' },
    avatarTxt: { fontSize: 20, fontWeight: 'bold', color: '#4338CA' },
    content: { flex: 1, marginLeft: 15 },
    nome: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
    prova: { fontSize: 13, color: '#64748B', marginTop: 2 },
    badge: { minWidth: 50, padding: 8, borderRadius: 12, alignItems: 'center' },
    badgeTxt: { fontSize: 18, fontWeight: '900' },
    empty: { alignItems: 'center', marginTop: 100 },
    emptyTxt: { marginTop: 15, color: '#94A3B8', fontSize: 16 }
});