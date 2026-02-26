import { useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface ScannedResult {
  id_folha: string;
  aluno: string;
  resultado: { acertos: number; total: number };
}

export function useEscanearGabarito() {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [scannedResult, setScannedResult] = useState<ScannedResult | null>(null);
  const [isDetected, setIsDetected] = useState(false);
  const [flash, setFlash] = useState(false);
  
  // A ref da câmera fica no hook!
  const cameraRef = useRef<any>(null);

  const handleCameraReady = () => {
    setTimeout(() => setFlash(true), 500);
  };

  async function handleCapturar() {
    if (!cameraRef.current || loading) return;
    setLoading(true);

    try {
      const foto = await cameraRef.current.takePictureAsync({ 
        quality: 1.0, exif: false, skipProcessing: false 
      });

      const manipulada = await ImageManipulator.manipulateAsync(
        foto.uri,
        [{ crop: { 
          originX: foto.width * 0.05, originY: foto.height * 0.1, 
          width: foto.width * 0.9, height: foto.height * 0.8 
        } }], 
        { compress: 1.0, format: ImageManipulator.SaveFormat.PNG }
      );

      const formData = new FormData();
      formData.append('file', {
        uri: manipulada.uri, name: 'scan.png', type: 'image/png',
      } as any);

      const response = await fetch(`${API_URL}/corrigir-prova`, {
        method: 'POST', body: formData,
      });

      const resData = await response.json();

      if (response.ok && resData.status === "sucesso") {
        setScannedResult(resData);
      } else {
        Alert.alert("Erro", resData.msg || "Falha no processamento.");
      }
    } catch (error: any) {
      Alert.alert("Erro de Conexão", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSalvarNota() {
    if (!scannedResult?.id_folha) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('tb_folha_resposta')
        .update({
          nota_final: scannedResult.resultado.acertos,
          status: 'CORRIGIDA',
          data_correcao: new Date().toISOString()
        })
        .eq('id_folha', scannedResult.id_folha);

      if (error) throw error;

      Alert.alert("Sucesso", `Nota de ${scannedResult.aluno} salva!`, [
        { text: "Próximo", onPress: () => {
          setScannedResult(null);
          setIsDetected(false);
        }}
      ]);
    } catch (error: any) {
      Alert.alert("Erro ao Salvar", error.message);
    } finally {
      setLoading(false);
    }
  }

  const resetScanner = () => setScannedResult(null);
  const toggleFlash = () => setFlash(!flash);

  return {
    permission, requestPermission, cameraRef,
    loading, scannedResult, isDetected, setIsDetected, flash,
    handleCameraReady, handleCapturar, handleSalvarNota, resetScanner, toggleFlash
  };
}