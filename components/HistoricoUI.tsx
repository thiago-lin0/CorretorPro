import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../constants/Theme';
import { Correcao, ProvaFiltro } from '../hooks/useHistoricoCorrecoes';

export function FiltroProvas({ provas, selecionada, onSelect }: any) {
  return (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
        <TouchableOpacity style={[styles.chip, selecionada === null && styles.chipActive]} onPress={() => onSelect(null)}>
          <Text style={[styles.chipText, selecionada === null && styles.chipTextActive]}>Todas</Text>
        </TouchableOpacity>
        {provas.map((p: ProvaFiltro) => (
          <TouchableOpacity key={p.id_prova} style={[styles.chip, selecionada === p.id_prova && styles.chipActive]} onPress={() => onSelect(p.id_prova)}>
            <Text style={[styles.chipText, selecionada === p.id_prova && styles.chipTextActive]}>{p.titulo}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export function CardCorrecao({ item }: { item: Correcao }) {
  const nome = item.tb_aluno?.nome_completo || "Aluno";
  const nota = item.nota_final || 0;
  const dataObj = item.data_correcao ? new Date(item.data_correcao) : null;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}><Text style={styles.avatarTxt}>{nome.charAt(0)}</Text></View>
        <View style={styles.content}>
          <Text style={styles.nome} numberOfLines={1}>{nome}</Text>
          <View style={styles.row}>
            <Ionicons name="document-text-outline" size={12} color={COLORS.textLight} />
            <Text style={styles.subText}> {item.tb_prova?.titulo} </Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.subText}>{dataObj?.toLocaleDateString('pt-BR')}</Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: nota >= 6 ? '#DCFCE7' : '#FEE2E2' }]}>
          <Text style={[styles.badgeTxt, { color: nota >= 6 ? COLORS.successDark : COLORS.danger }]}>{nota.toFixed(1)}</Text>
        </View>
      </View>
    </View>
  );
}

export function ListaVazia() {
  return (
    <View style={styles.empty}>
      <Ionicons name="school-outline" size={60} color={COLORS.border} />
      <Text style={styles.emptyTxt}>Nenhuma correção encontrada para esta unidade.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: { backgroundColor: COLORS.surface, paddingVertical: 12 },
  filterScroll: { paddingHorizontal: 16 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: SIZES.radiusLarge, backgroundColor: COLORS.borderLight, marginRight: 10, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primaryDark, borderColor: COLORS.primaryDark },
  chipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '700' },
  chipTextActive: { color: COLORS.surface },
  card: { backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLarge, padding: 16, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: SIZES.radiusMedium, backgroundColor: COLORS.borderLight, justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  content: { flex: 1, marginLeft: 14 },
  nome: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  subText: { fontSize: 11, color: COLORS.textLight, fontWeight: '500' },
  separator: { marginHorizontal: 5, color: COLORS.border, fontSize: 10 },
  badge: { minWidth: 50, padding: 8, borderRadius: SIZES.radiusMedium, alignItems: 'center' },
  badgeTxt: { fontSize: 17, fontWeight: '900' },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyTxt: { marginTop: 15, color: COLORS.textLight, fontSize: 14, textAlign: 'center', paddingHorizontal: 40 }
});