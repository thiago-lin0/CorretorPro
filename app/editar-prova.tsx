import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Imports dos nossos componentes isolados
import { DescritorModal } from '../components/DescritorModal';
import { QuestaoCard } from '../components/QuestaoCard';
import { useEditarProva } from '../hooks/useEditarProva';

export default function EditarProvaScreen() {
  const params = useLocalSearchParams();
  
  // 1. Puxando tudo do Hook!
  const {
    loading, salvando, nomeProva, setNomeProva, dataAplicacao, setDataAplicacao,
    qtdQuestoes, setQtdQuestoes, turmas, turmasSelecionadas, toggleTurma,
    respostas, setRespostas, descritores, setDescritores, handleAtualizar
  } = useEditarProva(params.id);

  // 2. Estados de UI (que só pertencem à visualização desta tela)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalDescritorVisible, setModalDescritorVisible] = useState(false);
  const [questaoAlvo, setQuestaoAlvo] = useState<number | null>(null);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#003399"/></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#003399" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Prova</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* CARD DE CONFIGURAÇÕES */}
        <View style={styles.formCard}>
          <Text style={styles.label}>Título da Prova</Text>
          <TextInput style={styles.input} value={nomeProva} onChangeText={setNomeProva} />
          
          <Text style={styles.label}>Data</Text>
          <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>
              {dataAplicacao.toLocaleDateString('pt-BR')}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker 
              value={dataAplicacao} 
              mode="date" 
              textColor="black" 
              locale="pt-BR" 
              themeVariant="light"
              onChange={(e, d) => { 
                if(Platform.OS === 'android') setShowDatePicker(false); 
                if(d) setDataAplicacao(d); 
              }} 
            />
          )}

          <Text style={[styles.label, {marginTop:15}]}>Turmas:</Text>
          <View style={styles.turmasGrid}>
            {turmas.map(t => (
              <TouchableOpacity 
                key={t.id_turma} 
                style={[styles.turmaChip, turmasSelecionadas.includes(t.id_turma) && styles.turmaChipActive]} 
                onPress={() => toggleTurma(t.id_turma)}
              >
                <Text style={[styles.turmaChipText, turmasSelecionadas.includes(t.id_turma) && styles.turmaChipTextActive]}>
                  {t.serie}º {t.turma}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, {marginTop:15}]}>Nº Questões:</Text>
          <TextInput style={styles.inputSmall} keyboardType="numeric" value={qtdQuestoes} onChangeText={setQtdQuestoes} />
        </View>

        {/* LISTA DE QUESTÕES (Usando o componente isolado) */}
        <View style={{ marginBottom: 20 }}>
          {Array.from({ length: parseInt(qtdQuestoes) || 0 }).map((_, i) => {
            const num = i + 1;
            return (
              <QuestaoCard
                key={num}
                numero={num}
                respostaSelecionada={respostas[num]}
                descritorSelecionado={descritores[num]}
                onSelectResposta={(letra) => setRespostas(p => ({ ...p, [num]: letra }))}
                onPressDescritor={() => { setQuestaoAlvo(num); setModalDescritorVisible(true); }}
              />
            );
          })}
        </View>

        {/* BOTÃO SALVAR */}
        <TouchableOpacity style={styles.btnSave} onPress={handleAtualizar} disabled={salvando}>
          {salvando ? <ActivityIndicator color="#FFF"/> : <Text style={styles.btnSaveText}>Salvar Alterações</Text>}
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL ISOLADO */}
      <DescritorModal
        visible={modalDescritorVisible}
        onClose={() => setModalDescritorVisible(false)}
        onSelect={(item) => {
          if (questaoAlvo) setDescritores(p => ({ ...p, [questaoAlvo]: item }));
          setModalDescritorVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

// Estilos apenas do layout da tela
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  center: { flex:1, justifyContent:'center', alignItems:'center'},
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#003399' },
  formCard: { backgroundColor: '#F8FAFF', padding: 20, borderRadius: 25, marginBottom: 20, borderWidth: 1, borderColor: '#F0F4FF' },
  input: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#EBF0FF' },
  dateSelector: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#EBF0FF' },
  dateText: { fontSize: 16, color: '#333' },
  label: { fontSize: 11, fontWeight: '900', color: '#003399', marginBottom: 5, marginTop: 5, textTransform: 'uppercase' },
  turmasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  turmaChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDE3ED' },
  turmaChipActive: { backgroundColor: '#003399', borderColor: '#003399' },
  turmaChipText: { color: '#666', fontWeight: 'bold', fontSize: 11 },
  turmaChipTextActive: { color: '#FFF' },
  inputSmall: { backgroundColor: '#FFF', width: 60, padding: 10, borderRadius: 10, textAlign: 'center', fontWeight: '800', borderWidth: 1, borderColor: '#EBF0FF' },
  btnSave: { backgroundColor: '#1E3A8A', padding: 20, borderRadius: 20, alignItems: 'center', marginBottom: 40 },
  btnSaveText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});