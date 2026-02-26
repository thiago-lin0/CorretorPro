import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Nossos módulos isolados
import { ModalGerenciarAluno, ModalNovaTurma } from '../components/ConfiguracaoModals';
import { useConfiguracao } from '../hooks/useConfiguracao';

export default function ConfiguracaoScreen() {
  const {
    tab, setTab, loading, turmas, alunos, listaAgrupada, turmaSelecionadaObj,
    serieExpandida, setSerieExpandida, filtroNome, setFiltroNome,
    modalTurmaVisible, setModalTurmaVisible, novaSerie, setNovaSerie, novaTurmaLetra, setNovaTurmaLetra, novoTurno, setNovoTurno,
    modalAlunoVisible, setModalAlunoVisible, modoAluno, setModoAluno, nomeAluno, setNomeAluno, 
    idTurmaSelecionada, setIdTurmaSelecionada, dropdownAberto, setDropdownAberto, importando,
    abrirModalNovoAluno, abrirModalEditarAluno, handleSalvarTurma, handleSalvarAluno, handleImportarXLSX
  } = useConfiguracao();

  if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color="#003399" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#003399" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Turmas & Alunos</Text>
        <View style={{ width: 40 }} /> 
      </View>

      {/* TABS */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, tab === 'turmas' && styles.tabActive]} onPress={() => setTab('turmas')}>
          <Text style={[styles.tabText, tab === 'turmas' && styles.tabTextActive]}>Turmas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'alunos' && styles.tabActive]} onPress={() => setTab('alunos')}>
          <Text style={[styles.tabText, tab === 'alunos' && styles.tabTextActive]}>Alunos</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        
        {/* ABA: TURMAS */}
        {tab === 'turmas' ? (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>SÉRIES CADASTRADAS</Text>
              <TouchableOpacity onPress={() => setModalTurmaVisible(true)}>
                <Text style={styles.addBtnText}>+ NOVA TURMA</Text>
              </TouchableOpacity>
            </View>
            
            {listaAgrupada.map((item: any) => (
              <View key={item.serie} style={styles.groupWrapper}>
                <TouchableOpacity style={styles.card} onPress={() => setSerieExpandida(serieExpandida === item.serie ? null : item.serie)}>
                  <View>
                    <Text style={styles.cardTitle}>{item.serie}º Ano</Text>
                    <Text style={styles.cardSub}>{item.subTurmas.length} turmas • {item.totalAlunos} alunos</Text>
                  </View>
                  <Ionicons name={serieExpandida === item.serie ? "chevron-up" : "chevron-down"} size={20} color="#CCC" />
                </TouchableOpacity>
                
                {serieExpandida === item.serie && item.subTurmas.map((st: any) => (
                  <View key={st.id_turma} style={styles.subCard}>
                    <View>
                      <Text style={styles.subCardTitle}>Turma {st.turma}</Text>
                      <Text style={styles.subCardShift}>{st.turno}</Text>
                    </View>
                    <Text style={styles.subCardText}>{st.tb_aluno[0]?.count || 0} alunos</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : (
          
          /* ABA: ALUNOS */
          <View>
            <TouchableOpacity style={styles.primaryAddBtn} onPress={abrirModalNovoAluno}>
              <Text style={styles.primaryAddBtnText}>+ Adicionar Alunos</Text>
            </TouchableOpacity>
            
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={18} color="#AAA" style={{ marginRight: 10 }} />
              <TextInput style={styles.searchInput} placeholder="Filtrar por nome..." value={filtroNome} onChangeText={setFiltroNome} />
            </View>
            
            {alunos.filter(a => a.nome_completo.toLowerCase().includes(filtroNome.toLowerCase())).map((item: any) => (
              <TouchableOpacity key={item.id_aluno} style={styles.alunoItem} onPress={() => abrirModalEditarAluno(item)}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{item.nome_completo[0]}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.alunoName}>{item.nome_completo}</Text>
                  <Text style={styles.alunoClass}>{item.tb_turma?.serie}º {item.tb_turma?.turma} - {item.tb_turma?.turno}</Text>
                </View>
                <Ionicons name="pencil-outline" size={16} color="#10B981" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* COMPONENTES MODAIS ISOLADOS */}
      <ModalNovaTurma 
        visible={modalTurmaVisible} onClose={() => setModalTurmaVisible(false)} onSave={handleSalvarTurma}
        serie={novaSerie} setSerie={setNovaSerie} turmaLetra={novaTurmaLetra} setTurmaLetra={setNovaTurmaLetra} turno={novoTurno} setTurno={setNovoTurno}
      />

      <ModalGerenciarAluno 
        visible={modalAlunoVisible} onClose={() => setModalAlunoVisible(false)}
        modo={modoAluno} setModo={setModoAluno} nome={nomeAluno} setNome={setNomeAluno}
        idTurma={idTurmaSelecionada} setIdTurma={setIdTurmaSelecionada} turmas={turmas} turmaObj={turmaSelecionadaObj}
        dropdownAberto={dropdownAberto} setDropdownAberto={setDropdownAberto} importando={importando}
        onSave={handleSalvarAluno} onImport={handleImportarXLSX}
      />
    </SafeAreaView>
  );
}

// Estilos apenas das abas e listas
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  loading: { flex: 1, justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#003399' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#F0F2F5', marginHorizontal: 20, marginBottom: 20, borderRadius: 15, padding: 5 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  tabActive: { backgroundColor: '#FFF', elevation: 3 },
  tabText: { color: '#888', fontWeight: 'bold' },
  tabTextActive: { color: '#003399' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' },
  sectionTitle: { fontSize: 11, fontWeight: '900', color: '#444' },
  addBtnText: { color: '#10B981', fontSize: 11, fontWeight: '900' },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderRadius: 20, marginBottom: 10, borderWidth: 1, borderColor: '#F0F5FF' },
  cardTitle: { fontSize: 17, fontWeight: 'bold' },
  cardSub: { fontSize: 13, color: '#AAA' },
  groupWrapper: { marginBottom: 10 },
  subCard: { backgroundColor: '#F8FAFF', padding: 15, marginHorizontal: 10, borderRadius: 12, marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subCardTitle: { fontWeight: 'bold', color: '#003399' },
  subCardShift: { fontSize: 11, color: '#666', textTransform: 'uppercase' },
  subCardText: { color: '#AAA', fontSize: 12 },
  primaryAddBtn: { backgroundColor: '#1E3A8A', paddingVertical: 16, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  primaryAddBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7FA', paddingHorizontal: 15, borderRadius: 12, marginBottom: 20 },
  searchInput: { flex: 1, paddingVertical: 12 },
  alunoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 15 },
  avatar: { width: 45, height: 45, borderRadius: 25, backgroundColor: '#F0F2F5', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#003399', fontWeight: 'bold' },
  alunoName: { fontWeight: '700', fontSize: 15 },
  alunoClass: { fontSize: 11, color: '#AAA' }
});