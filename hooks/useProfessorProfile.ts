import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export type ProfessorData = {
  nome: string;
  tb_escola: { nome: string; } | null;
};

export function useProfessorProfile() {
  const [loading, setLoading] = useState(true);
  const [professor, setProfessor] = useState<ProfessorData | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace('/');
          return;
        }

        const { data, error } = await supabase
          .from('tb_professor')
          .select(`nome, tb_escola (nome)`)
          .eq('auth_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          const escolaRef = Array.isArray(data.tb_escola) ? data.tb_escola[0] : data.tb_escola;
          setProfessor({
            nome: data.nome,
            tb_escola: escolaRef
          } as ProfessorData);
        }
      } catch (error) {
        console.log("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  return { professor, loading };
}