import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function useListaProvas() {
  const [provas, setProvas] = useState<any[]>([]);
  const [loadingLista, setLoadingLista] = useState(true);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const carregarProvas = useCallback(async () => {
    setLoadingLista(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('tb_prova')
        .select(`*, tb_aplicacao_prova (id_turma, tb_turma (serie, turma, turno))`)
        .eq('id_professor', user?.id)
        .order('id_prova', { ascending: false });
      
      if (error) throw error;
      setProvas(data || []);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoadingLista(false); 
      setRefreshing(false); 
    }
  }, []);

  async function handleBaixarPDF(idTurma: number, idProva: number) {
    setLoadingDownload(true);
    try {
      const downloadUrl = `${API_URL}/gerar-pdf-turma/${idTurma}?id_prova=${idProva}`;
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Erro ao gerar PDF.");
      await WebBrowser.openBrowserAsync(downloadUrl);
    } catch (error: any) {
      Alert.alert("Erro", "Verifique se a API no PC está rodando.");
    } finally { 
      setLoadingDownload(false); 
    }
  }

  async function handleExcluirProva(id_prova: number) {
    Alert.alert("Excluir", "Apagar prova?", [
      { text: "Não" },
      { text: "Sim", onPress: async () => { 
        await supabase.from('tb_prova').delete().eq('id_prova', id_prova); 
        carregarProvas(); 
      }}
    ]);
  }

  return {
    provas, loadingLista, loadingDownload, refreshing, setRefreshing,
    carregarProvas, handleBaixarPDF, handleExcluirProva
  };
}