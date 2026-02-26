import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../constants/Theme';

interface QuestaoCardProps {
  numero: number;
  respostaSelecionada?: string;
  descritorSelecionado?: string;
  onSelectResposta: (letra: string) => void;
  onPressDescritor: () => void;
}

export function QuestaoCard({ numero, respostaSelecionada, descritorSelecionado, onSelectResposta, onPressDescritor }: QuestaoCardProps) {
  const alternativas = ['A', 'B', 'C', 'D'];

  return (
    <View style={styles.questaoCard}>
      <View style={styles.questaoTopo}>
        <View style={styles.badgeNum}>
          <Text style={styles.txtNum}>{numero}</Text>
        </View>
        <TouchableOpacity style={styles.selectorDescritor} onPress={onPressDescritor}>
          <Text style={[styles.txtDescritor, !descritorSelecionado && { color: COLORS.textLight }]}>
            {descritorSelecionado || "Descritor"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.altsContainer}>
        {alternativas.map(letra => (
          <TouchableOpacity 
            key={letra} 
            style={[styles.btnAlt, respostaSelecionada === letra && styles.btnAltActive]} 
            onPress={() => onSelectResposta(letra)}
          >
            <Text style={[styles.txtAlt, respostaSelecionada === letra && styles.txtAltActive]}>
              {letra}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  questaoCard: { backgroundColor: COLORS.borderLight, padding: 15, borderRadius: SIZES.radiusLarge, marginBottom: 15 },
  questaoTopo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  badgeNum: { width: 30, height: 30, backgroundColor: COLORS.primary, borderRadius: SIZES.radiusSmall, justifyContent: 'center', alignItems: 'center' },
  txtNum: { color: COLORS.surface, fontWeight: 'bold' },
  selectorDescritor: { flex: 1, marginLeft: 15, backgroundColor: COLORS.surface, padding: 10, borderRadius: SIZES.radiusMedium, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  txtDescritor: { fontSize: 13, fontWeight: 'bold', color: COLORS.primary },
  altsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  btnAlt: { width: '22%', height: 45, borderRadius: SIZES.radiusMedium, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  btnAltActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  txtAlt: { fontWeight: '800', color: COLORS.textSecondary, fontSize: 16 },
  txtAltActive: { color: COLORS.surface },
});