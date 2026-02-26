import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/Theme';
import { ScannedResult } from '../hooks/useEscanearGabarito';

// --- OVERLAY DE LOADING ---
export function ScannerLoading({ text = "Processando..." }: { text?: string }) {
  return (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#4ADE80" />
      <Text style={styles.loadingText}>{text}</Text>
    </View>
  );
}

// --- CARD DE RESULTADO ---
interface ScannerResultCardProps {
  result: ScannedResult;
  onSave: () => void;
  onDiscard: () => void;
}

export function ScannerResultCard({ result, onSave, onDiscard }: ScannerResultCardProps) {
  return (
    <View style={styles.cardResult}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{result.aluno}</Text>
        <Text style={styles.cardScore}>Acertos: {result.resultado.acertos}/{result.resultado.total}</Text>
      </View>
      <TouchableOpacity style={styles.btnSave} onPress={onSave}>
        <Text style={styles.btnSaveTxt}>CONFIRMAR E SALVAR</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnDiscard} onPress={onDiscard}>
        <Text style={styles.btnDiscardTxt}>Descartar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: COLORS.overlay, justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  loadingText: { color: COLORS.surface, marginTop: 15, fontSize: 16, fontWeight: 'bold' },
  cardResult: { width: '90%', backgroundColor: COLORS.surface, borderRadius: 25, padding: 20, elevation: 10 },
  cardInfo: { marginBottom: 15 },
  cardName: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary },
  cardScore: { fontSize: 16, color: COLORS.success, fontWeight: 'bold', marginTop: 5 },
  btnSave: { backgroundColor: COLORS.primaryDark, padding: 15, borderRadius: 12, alignItems: 'center' },
  btnSaveTxt: { color: COLORS.surface, fontWeight: 'bold' },
  btnDiscard: { marginTop: 15, alignItems: 'center' },
  btnDiscardTxt: { color: COLORS.textSecondary, fontSize: 14 }
});