import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFormProva } from '../hooks/useFormProva';

export default function FormProvaScreen() {
  const { id } = useLocalSearchParams(); // Pega o ID se existir!
  
  const {
    loadingSalvar, turmasDisponiveis, nomeProva, setNomeProva, materia, setMateria, 
    turmasSelecionadas, setTurmasSelecionadas, qtdQuestoes, setQtdQuestoes,
    respostas, setRespostas, descritores, setDescritores, handleSalvar
  } = useFormProva(id);

  const [modalDescritorVisible, setModalDescritorVisible] = useState(false);
  const [questaoAlvo, setQuestaoAlvo] = useState<number | null>(null);

  const alternativas = ['A', 'B', 'C', 'D'];
  const listaDescritores = Array.from({ length: materia === 'MAT' ? 37 : 21 }, (_, i) => `D${i + 1}`);

  const selecionarDescritor = (desc: string) => {
    if (questaoAlvo !== null) setDescritores(prev => ({ ...prev, [questaoAlvo]: desc }));
    setModalDescritorVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        <View style={styles.formHeader}>
            <TouchableOpacity onPress={() => router.back()}><Ionicons name="close" size={28} color="#333"/></TouchableOpacity>
            <Text style={styles.titleForm}>{id ? 'Editar Gabarito' : 'Novo Gabarito'}</Text>
        </View>
        
        <Text style={styles.label}>Título da Prova</Text>
        <TextInput style={styles.input} value={nomeProva} onChangeText={setNomeProva} placeholder="Ex: Avaliação Bimestral" />

        <Text style={styles.label}>Disciplina</Text>
        <View style={styles.materiaContainer}>
          <TouchableOpacity style={[styles.materiaBtn, materia === 'MAT' && styles.materiaBtnActive]} onPress={() => { setMateria('MAT'); setDescritores({}); }}>
              <Text style={[styles.materiaBtnText, materia === 'MAT' && {color: '#FFF'}]}>MATEMÁTICA</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.materiaBtn, materia === 'PORT' && styles.materiaBtnActive]} onPress={() => { setMateria('PORT'); setDescritores({}); }}>
              <Text style={[styles.materiaBtnText, materia === 'PORT' && {color: '#FFF'}]}>PORTUGUÊS</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.label}>Vincular Turmas</Text>
        <View style={styles.turmasGrid}>
          {turmasDisponiveis.map(t => (
            <TouchableOpacity key={t.id_turma} style={[styles.chip, turmasSelecionadas.includes(t.id_turma) && styles.chipActive]} onPress={() => setTurmasSelecionadas(p => p.includes(t.id_turma) ? p.filter(x => x !== t.id_turma) : [...p, t.id_turma])}>
              <Text style={[styles.chipText, turmasSelecionadas.includes(t.id_turma) && {color:'#FFF'}]}>{t.serie}º {t.turma}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.gabaritoHeader}>
          <Text style={styles.label}>Gabarito Oficial</Text>
          <View style={styles.qtdBox}>
            <Text style={{fontSize: 12, color: '#666'}}>Questões:</Text>
            <TextInput style={styles.inputQtd} keyboardType="numeric" value={qtdQuestoes} onChangeText={setQtdQuestoes} maxLength={2} />
          </View>
        </View>

        <View style={styles.gabaritoCard}>
          {Array.from({ length: parseInt(qtdQuestoes) || 0 }).map((_, index) => {
            const i = index + 1;
            return (
              <View key={i} style={styles.questaoRow}>
                <Text style={styles.questaoNumero}>{i < 10 ? `0${i}` : i}</Text>
                <View style={styles.alternativasContainer}>
                  {alternativas.map(alt => (
                    <TouchableOpacity 
                      key={alt} 
                      style={[styles.altBtn, respostas[i] === alt && styles.altBtnActive]}
                      onPress={() => setRespostas(prev => ({ ...prev, [i]: alt }))}
                    >
                      <Text style={[styles.altText, respostas[i] === alt && { color: '#FFF' }]}>{alt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity style={styles.btnAbreDescritor} onPress={() => { setQuestaoAlvo(i); setModalDescritorVisible(true); }}>
                  <Text style={styles.textDescritor}>{descritores[i] || 'Desc.'}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        
        <TouchableOpacity style={styles.btnSave} onPress={handleSalvar} disabled={loadingSalvar}>
            {loadingSalvar ? <ActivityIndicator color="#FFF"/> : <Text style={styles.btnSaveText}>{id ? 'SALVAR ALTERAÇÕES' : 'CRIAR PROVA E GABARITO'}</Text>}
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL DESCRITORES */}
      <Modal visible={modalDescritorVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalDescritorVisible(false)}>
          <View style={styles.modalDescContent}>
            <View style={styles.modalHeaderIndicator} />
            <Text style={styles.modalTitle}>Selecionar Descritor ({materia === 'MAT' ? 'Matemática' : 'Português'})</Text>
            <ScrollView contentContainerStyle={styles.descritoresGrid}>
              {listaDescritores.map(d => (
                <TouchableOpacity key={d} style={styles.descItem} onPress={() => selecionarDescritor(d)}>
                  <Text style={styles.descItemText}>{d}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

// Repita os estilos do formulário que já existiam no seu arquivo original aqui em baixo...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  formHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  titleForm: { fontSize: 18, fontWeight: 'bold', marginLeft: 15, color: '#1E293B' },
  label: { fontSize: 13, fontWeight: 'bold', color: '#475569', marginBottom: 5 },
  input: { backgroundColor: '#FFF', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', marginBottom: 10 },
  materiaContainer: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  materiaBtn: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#DDD', alignItems: 'center', backgroundColor: '#FFF' },
  materiaBtnActive: { backgroundColor: '#003399', borderColor: '#003399' },
  materiaBtnText: { fontSize: 12, fontWeight: 'bold', color: '#64748B' },
  turmasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, backgroundColor: '#E2E8F0' },
  chipActive: { backgroundColor: '#003399' },
  chipText: { fontSize: 11, color: '#475569' },
  gabaritoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  qtdBox: { flexDirection: 'row', alignItems: 'center' },
  inputQtd: { backgroundColor: '#FFF', width: 45, padding: 5, borderRadius: 6, borderWidth: 1, borderColor: '#DDD', marginLeft: 10, textAlign: 'center' },
  gabaritoCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#E2E8F0', marginTop: 10 },
  questaoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  questaoNumero: { width: 30, fontSize: 14, fontWeight: 'bold', color: '#003399' },
  alternativasContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 10 },
  altBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  altBtnActive: { backgroundColor: '#003399', borderColor: '#003399' },
  altText: { fontSize: 13, fontWeight: 'bold', color: '#64748B' },
  btnAbreDescritor: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: '#E2E8F0', minWidth: 60, alignItems: 'center' },
  textDescritor: { fontSize: 12, fontWeight: 'bold', color: '#003399' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalDescContent: { backgroundColor: '#FFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, maxHeight: '75%' },
  modalHeaderIndicator: { width: 40, height: 5, backgroundColor: '#E2E8F0', borderRadius: 3, alignSelf: 'center', marginBottom: 15 },
  descritoresGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  descItem: { width: '23%', backgroundColor: '#F8FAFC', paddingVertical: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  descItemText: { fontWeight: 'bold', color: '#1E293B', fontSize: 14 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  btnSave: { backgroundColor: '#003399', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  btnSaveText: { color: '#FFF', fontWeight: 'bold' }
});