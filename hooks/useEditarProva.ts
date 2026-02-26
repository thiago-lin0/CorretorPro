import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export function useEditarProva(idProva: string | string[]) {
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  
  const [nomeProva, setNomeProva] = useState('');
  const [dataAplicacao, setDataAplicacao] = useState(new Date());
  const [qtdQuestoes, setQtdQuestoes] = useState('10');
  
  const [turmas, setTurmas] = useState<any[]>([]);
  const [turmasSelecionadas, setTurmasSelecionadas] = useState<number[]>([]);
  
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [descritores, setDescritores] = useState<Record<number, string>>({});

  useEffect(() => {
    if (idProva) carregarDadosProva();
  }, [idProva]);

  async function carregarDadosProva() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: prof } = await supabase.from('tb_professor').select('id_escola').eq('auth_id', user?.id).single();
      if (prof) {
        const { data: t } = await supabase.from('tb_turma').select('*').eq('id_escola', prof.id_escola);
        setTurmas(t || []);
      }

      const { data: prova, error } = await supabase.from('tb_prova').select('*').eq('id_prova', idProva).single();
      if (error) throw error;
      
      setNomeProva(prova.titulo);
      setDataAplicacao(new Date(prova.data_aplicacao));
      setQtdQuestoes(prova.qtd_questoes.toString());

      const { data: vinculos } = await supabase.from('tb_aplicacao_prova').select('id_turma').eq('id_prova', idProva);
      if (vinculos) setTurmasSelecionadas(vinculos.map(v => v.id_turma));

      const { data: questoes } = await supabase.from('tb_questao').select('*').eq('id_prova', idProva);
      if (questoes) {
        const respTemp: any = {};
        const descTemp: any = {};
        questoes.forEach(q => {
          respTemp[q.numero_questao] = q.alternativa_correta?.trim();
          descTemp[q.numero_questao] = q.descritor;
        });
        setRespostas(respTemp);
        setDescritores(descTemp);
      }
    } catch (e) {
      Alert.alert("Erro", "Falha ao carregar prova.");
      router.back();
    } finally {
      setLoading(false);
    }
  }

  const handleAtualizar = async () => {
    if (!nomeProva || turmasSelecionadas.length === 0) return Alert.alert("Atenção", "Preencha título e turmas.");
    if (Object.keys(respostas).length < parseInt(qtdQuestoes)) return Alert.alert("Atenção", "Preencha todo o gabarito.");

    setSalvando(true);
    try {
      const dataISO = dataAplicacao.toISOString().split('T')[0];

      await supabase.from('tb_prova').update({
        titulo: nomeProva, data_aplicacao: dataISO, qtd_questoes: parseInt(qtdQuestoes)
      }).eq('id_prova', idProva);

      const { data: atuais } = await supabase.from('tb_aplicacao_prova').select('id_turma').eq('id_prova', idProva);
      const idsAtuais = atuais?.map(a => a.id_turma) || [];

      const paraAdicionar = turmasSelecionadas.filter(id => !idsAtuais.includes(id));
      const paraRemover = idsAtuais.filter(id => !turmasSelecionadas.includes(id));

      if (paraRemover.length > 0) {
        await supabase.from('tb_aplicacao_prova').delete().eq('id_prova', idProva).in('id_turma', paraRemover);
      }
      if (paraAdicionar.length > 0) {
        await supabase.from('tb_aplicacao_prova').insert(paraAdicionar.map(idT => ({
          id_prova: idProva, id_turma: idT, data_aplicacao: dataISO
        })));
      }

      const { data: qExistentes } = await supabase.from('tb_questao').select('id_questao, numero_questao').eq('id_prova', idProva);
      const upsertData = [];
      const totalQ = parseInt(qtdQuestoes);

      for (let i = 1; i <= totalQ; i++) {
        const existente = qExistentes?.find(q => q.numero_questao === i);
        upsertData.push({
          id_questao: existente ? existente.id_questao : undefined,
          id_prova: idProva, numero_questao: i, alternativa_correta: respostas[i], descritor: descritores[i] || ""
        });
      }

      await supabase.from('tb_questao').upsert(upsertData);

      if (qExistentes && qExistentes.length > totalQ) {
         await supabase.from('tb_questao').delete().eq('id_prova', idProva).gt('numero_questao', totalQ);
      }

      Alert.alert("Sucesso", "Prova atualizada!");
      router.back();

    } catch (e: any) {
      Alert.alert("Erro", e.message);
    } finally {
      setSalvando(false);
    }
  };

  const toggleTurma = (id: number) => {
    setTurmasSelecionadas(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  return {
    loading, salvando, nomeProva, setNomeProva, dataAplicacao, setDataAplicacao,
    qtdQuestoes, setQtdQuestoes, turmas, turmasSelecionadas, toggleTurma,
    respostas, setRespostas, descritores, setDescritores, handleAtualizar
  };
}