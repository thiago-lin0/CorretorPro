import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
          <Text style={[styles.txtDescritor, !descritorSelecionado && { color: '#AAA' }]}>
            {descritorSelecionado || "D1-D37"}
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
  questaoCard: { backgroundColor: '#F5F7FA', padding: 15, borderRadius: 20, marginBottom: 15 },
  questaoTopo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  badgeNum: { width: 30, height: 30, backgroundColor: '#003399', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  txtNum: { color: '#FFF', fontWeight: 'bold' },
  selectorDescritor: { flex: 1, marginLeft: 15, backgroundColor: '#FFF', padding: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#DDE3ED' },
  txtDescritor: { fontSize: 13, fontWeight: 'bold', color: '#003399' },
  altsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  btnAlt: { width: '22%', height: 45, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#DDE3ED' },
  btnAltActive: { backgroundColor: '#003399', borderColor: '#003399' },
  txtAlt: { fontWeight: '800', color: '#778899', fontSize: 16 },
  txtAltActive: { color: '#FFF' },
});