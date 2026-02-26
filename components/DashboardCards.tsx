import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- CARD QUADRADO (Turmas / Provas) ---
interface SquareCardProps {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  onPress: () => void;
}
export function SquareCard({ title, icon, bgColor, onPress }: SquareCardProps) {
  return (
    <TouchableOpacity style={styles.squareCard} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
        {icon}
      </View>
      <Text style={styles.squareCardText}>{title}</Text>
    </TouchableOpacity>
  );
}

// --- CARD HERÓI (Câmera principal) ---
interface HeroCardProps {
  title: string;
  subtitle: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}
export function HeroCard({ title, subtitle, iconName, onPress }: HeroCardProps) {
  return (
    <TouchableOpacity style={styles.heroCard} onPress={onPress}>
      <View>
        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroSubtitle}>{subtitle}</Text>
      </View>
      <View style={styles.heroIconBox}>
        <Ionicons name={iconName} size={32} color="#FFF" />
      </View>
    </TouchableOpacity>
  );
}

// --- CARD LARGO (Histórico / Relatórios) ---
interface WideCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
  onPress: () => void;
  style?: object;
}
export function WideCard({ title, subtitle, icon, bgColor, onPress, style }: WideCardProps) {
  return (
    <TouchableOpacity style={[styles.wideCard, style]} onPress={onPress}>
      <View style={styles.wideCardLeft}>
        <View style={[styles.iconCircleSmall, { backgroundColor: bgColor }]}>
          {icon}
        </View>
        <View>
          <Text style={styles.wideCardTitle}>{title}</Text>
          <Text style={styles.wideCardSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );
}

// Estilos dos Cards exportados para cá
const styles = StyleSheet.create({
  squareCard: { backgroundColor: '#FFF', width: '48%', paddingVertical: 25, borderRadius: 25, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.05 },
  iconCircle: { width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  squareCardText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  heroCard: { backgroundColor: '#1E3A8A', borderRadius: 25, padding: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, elevation: 8, shadowColor: '#1E3A8A', shadowOpacity: 0.3 },
  heroTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  heroSubtitle: { color: '#A3B3E5', fontSize: 14, marginTop: 4 },
  heroIconBox: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 15, borderRadius: 20 },
  wideCard: { backgroundColor: '#FFF', borderRadius: 22, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05 },
  wideCardLeft: { flexDirection: 'row', alignItems: 'center' },
  iconCircleSmall: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  wideCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  wideCardSubtitle: { fontSize: 12, color: '#888' },
});