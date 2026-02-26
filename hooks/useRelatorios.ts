import { useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { supabase } from '../lib/supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Prova {
  id_prova: number;
  titulo: string;
  criado_em: string;
}

export function useRelatorios() {
  const [provas, setProvas] = useState<Prova[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProvas();
  }, []);

  async function fetchProvas() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tb_prova')
        .select('id_prova, titulo, criado_em') 
        .order('criado_em', { ascending: false });

      if (error) throw error;
      if (data) setProvas(data);
    } catch (error: any) {
      console.log("Erro ao carregar provas:", error.message);
      Alert.alert("Erro", "Não foi possível carregar as provas.");
    } finally {
      setLoading(false);
    }
  }

  async function baixarRelatorio(id_prova: number) {
    const url = `${API_URL}/relatorio/prova/consolidado/${id_prova}`;
    
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        Alert.alert(
          "Baixar Relatório",
          "O navegador será aberto para processar o download do Excel.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Baixar", onPress: () => Linking.openURL(url) }
          ]
        );
      } else {
        Alert.alert("Erro", "Não foi possível abrir o link de download.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um problema ao tentar baixar o arquivo.");
    }
  }

  return { provas, loading, baixarRelatorio };
}