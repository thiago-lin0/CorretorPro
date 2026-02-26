import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DownloadModal, ProvaCard } from '../components/ProvasListaUI';
import { useListaProvas } from '../hooks/useListaProvas';

export default function GestaoProvasScreen() {
  const {
    provas, loadingDownload, refreshing, carregarProvas, handleBaixarPDF, handleExcluirProva
  } = useListaProvas();

  const [modalDownloadVisible, setModalDownloadVisible] = useState(false);
  const [provaSelecionadaParaDownload, setProvaSelecionadaParaDownload] = useState<any>(null);

  // Recarrega a lista sempre que a tela ganha foco (ex: voltou da tela de criação)
  useFocusEffect(React.useCallback(() => { carregarProvas(); }, [carregarProvas]));

  return (
    <SafeAreaView style={styles.container}>
      {loadingDownload && (
        <View style={styles.overlayLoading}>
          <ActivityIndicator size="large" color="#003399" />
          <Text style={styles.loadingText}>Gerando PDF...</Text>
        </View>
      )}

      <View style={styles.headerLista}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={26} color="#003399"/></TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas Provas</Text>
      </View>

      <FlatList 
        data={provas} 
        keyExtractor={i => i.id_prova.toString()} 
        renderItem={({item}) => (
          <ProvaCard 
            item={item}
            // Navega para a tela de form passando o ID!
            onEdit={() => router.push({ pathname: '/form-prova', params: { id: item.id_prova } })}
            onDownloadPress={() => { setProvaSelecionadaParaDownload(item); setModalDownloadVisible(true); }}
            onDelete={() => handleExcluirProva(item.id_prova)}
          />
        )} 
        contentContainerStyle={{ padding: 20 }} 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarProvas}/>}
      />

      {/* Navega para a tela de form SEM ID (Modo Criação) */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/form-prova')}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      <DownloadModal 
        visible={modalDownloadVisible}
        prova={provaSelecionadaParaDownload}
        onClose={() => setModalDownloadVisible(false)}
        onDownload={(idTurma, idProva) => {
          handleBaixarPDF(idTurma, idProva);
          setModalDownloadVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerLista: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#003399', marginLeft: 15 },
  fab: { position: 'absolute', bottom: 60, right: 25, zIndex: 10, backgroundColor: '#003399', width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  overlayLoading: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  loadingText: { marginTop: 10, color: '#003399', fontWeight: 'bold' }
});