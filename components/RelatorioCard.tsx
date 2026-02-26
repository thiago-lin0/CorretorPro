import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../constants/Theme';
import { Prova } from '../hooks/useRelatorios';

export function RelatorioCard({ item, onDownload }: { item: Prova, onDownload: (id: number) => void }) {
  const dataFormatada = item.criado_em ? new Date(item.criado_em).toLocaleDateString('pt-BR') : '--';

  return (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="file-excel" size={30} color={COLORS.success} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.nomeProva}>{item.titulo}</Text>
          <Text style={styles.detalhesProva}>Criado em: {dataFormatada}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.botaoDownload} onPress={() => onDownload(item.id_prova)}>
        <Ionicons name="open-outline" size={20} color={COLORS.surface} style={{ marginRight: 8 }} />
        <Text style={styles.textoBotao}>ABRIR NO NAVEGADOR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: 15, padding: 20, marginBottom: 15, elevation: 3 },
  cardInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconBox: { width: 45, height: 45, borderRadius: SIZES.radiusSmall, backgroundColor: COLORS.borderLight, justifyContent: 'center', alignItems: 'center' },
  textContainer: { flex: 1, marginLeft: 15 },
  nomeProva: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary },
  detalhesProva: { fontSize: 12, color: COLORS.textLight, marginTop: 3 },
  botaoDownload: { backgroundColor: COLORS.success, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: SIZES.radiusSmall },
  textoBotao: { color: COLORS.surface, fontWeight: 'bold' }
});