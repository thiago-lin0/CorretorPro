import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Prova } from '../hooks/useRelatorios';

interface RelatorioCardProps {
  item: Prova;
  onDownload: (id: number) => void;
}

export function RelatorioCard({ item, onDownload }: RelatorioCardProps) {
  const dataFormatada = item.criado_em 
    ? new Date(item.criado_em).toLocaleDateString('pt-BR') 
    : '--';

  return (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="file-excel" size={30} color="#10B981" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.nomeProva}>{item.titulo}</Text>
          <Text style={styles.detalhesProva}>Criado em: {dataFormatada}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.botaoDownload}
        onPress={() => onDownload(item.id_prova)}
      >
        <Ionicons name="open-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.textoBotao}>ABRIR NO NAVEGADOR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 20, marginBottom: 15, elevation: 3 },
  cardInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconBox: { width: 45, height: 45, borderRadius: 10, backgroundColor: '#F0F4FF', justifyContent: 'center', alignItems: 'center' },
  textContainer: { flex: 1, marginLeft: 15 },
  nomeProva: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  detalhesProva: { fontSize: 12, color: '#94A3B8', marginTop: 3 },
  botaoDownload: { backgroundColor: '#10B981', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: 10 },
  textoBotao: { color: '#FFF', fontWeight: 'bold' }
});