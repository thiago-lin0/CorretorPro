import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL; 
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function EscanearGabaritoScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState(false);
    const [scannedResult, setScannedResult] = useState<any>(null);
    const [isDetected, setIsDetected] = useState(false); 
    const [flash, setFlash] = useState<boolean>(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    
    const cameraRef = useRef<any>(null);

    // 1. Ativa o flash automaticamente quando a câmera estiver pronta
    const handleCameraReady = () => {
        setIsCameraReady(true);
        setTimeout(() => setFlash(true), 500); // Delay para garantir o acionamento do hardware
    };

    if (!permission?.granted) {
        return (
            <View style={styles.containerCenter}>
                <TouchableOpacity style={styles.btnPermissao} onPress={requestPermission}>
                    <Text style={styles.btnText}>ATIVAR CÂMERA</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // 2. Captura com alta fidelidade para não perder rasuras (X)
    async function handleCapturar() {
        if (!cameraRef.current || loading) return;
        setLoading(true);

        try {
            const foto = await cameraRef.current.takePictureAsync({ 
                quality: 1.0, 
                exif: false,
                skipProcessing: false 
            });

            // Crop original sem resize para preservar detalhes finos
            const manipulada = await ImageManipulator.manipulateAsync(
                foto.uri,
                [{ crop: { 
                    originX: foto.width * 0.05, 
                    originY: foto.height * 0.1, 
                    width: foto.width * 0.9, 
                    height: foto.height * 0.8 
                } }], 
                { compress: 1.0, format: ImageManipulator.SaveFormat.PNG }
            );

            const formData = new FormData();
            formData.append('file', {
                uri: manipulada.uri,
                name: 'scan.png',
                type: 'image/png',
            } as any);

            const response = await fetch(`${API_URL}/corrigir-prova`, {
                method: 'POST',
                body: formData,
            });

            const resData = await response.json();
            console.log("LOG Resultado da IA:", resData.resultado?.acertos);

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

    // 3. Salva a nota no Supabase usando o id_folha retornado pela API
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

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" />
            
            {/* CameraView sem filhos para evitar avisos de performance */}
            <CameraView 
                style={StyleSheet.absoluteFill} 
                ref={cameraRef}
                facing="back"
                enableTorch={flash}
                autofocus="on"
                onCameraReady={handleCameraReady}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={(result) => {
                    if (result.data && !isDetected) {
                        Vibration.vibrate(80);
                        setIsDetected(true);
                    }
                }}
            />

            {/* Spinner Centralizado */}
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#4ADE80" />
                    <Text style={styles.loadingText}>Processando Gabarito...</Text>
                </View>
            )}

            {/* Overlay da UI */}
            <View style={styles.overlay} pointerEvents="box-none">
                <View style={styles.header}>
                    <TouchableOpacity style={styles.btnIcon} onPress={() => router.back()}>
                        <Ionicons name="close" size={28} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnIcon} onPress={() => setFlash(!flash)}>
                        <Ionicons name={flash ? "flashlight" : "flashlight-outline"} size={26} color={flash ? "#FFD700" : "#FFF"} />
                    </TouchableOpacity>
                </View>

                <View style={styles.viewfinder}>
                    <View style={[styles.guideFrame, isDetected && styles.frameActive]} />
                </View>

                <View style={styles.footer}>
                    {!scannedResult ? (
                        <TouchableOpacity 
                            style={[styles.btnCapture, !isDetected && styles.btnDisabled]} 
                            onPress={handleCapturar}
                            disabled={!isDetected || loading}
                        >
                            <View style={styles.btnCaptureInner} />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.cardResult}>
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardName}>{scannedResult.aluno}</Text>
                                <Text style={styles.cardScore}>Acertos: {scannedResult.resultado.acertos}/{scannedResult.resultado.total}</Text>
                            </View>
                            <TouchableOpacity style={styles.btnSave} onPress={handleSalvarNota}>
                                <Text style={styles.btnSaveTxt}>CONFIRMAR E SALVAR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnDiscard} onPress={() => setScannedResult(null)}>
                                <Text style={styles.btnDiscardTxt}>Descartar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    containerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    loadingOverlay: { 
        ...StyleSheet.absoluteFillObject, 
        backgroundColor: 'rgba(0,0,0,0.7)', 
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 1000 
    },
    loadingText: { color: '#FFF', marginTop: 15, fontSize: 16, fontWeight: 'bold' },
    overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 40 },
    btnIcon: { width: 44, height: 44, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    viewfinder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    guideFrame: { width: SCREEN_WIDTH * 0.85, aspectRatio: 0.7, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 20 },
    frameActive: { borderColor: '#4ADE80', backgroundColor: 'rgba(74, 222, 128, 0.05)' },
    footer: { paddingBottom: 40, alignItems: 'center' },
    btnCapture: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
    btnCaptureInner: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#FFF' },
    btnDisabled: { opacity: 0.3 },
    btnPermissao: { backgroundColor: '#2B428C', padding: 20, borderRadius: 15 },
    btnText: { color: '#FFF', fontWeight: 'bold' },
    cardResult: { width: '90%', backgroundColor: '#FFF', borderRadius: 25, padding: 20, elevation: 10 },
    cardInfo: { marginBottom: 15 },
    cardName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
    cardScore: { fontSize: 16, color: '#15803D', fontWeight: 'bold', marginTop: 5 },
    btnSave: { backgroundColor: '#2B428C', padding: 15, borderRadius: 12, alignItems: 'center' },
    btnSaveTxt: { color: '#FFF', fontWeight: 'bold' },
    btnDiscard: { marginTop: 15, alignItems: 'center' },
    btnDiscardTxt: { color: '#64748B', fontSize: 14 }
});