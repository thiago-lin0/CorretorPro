import { Ionicons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScannerLoading, ScannerResultCard } from '../components/ScannerUI';
import { useEscanearGabarito } from '../hooks/useEscanearGabarito';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function EscanearGabaritoScreen() {
  const {
    permission, requestPermission, cameraRef,
    loading, scannedResult, isDetected, setIsDetected, flash,
    handleCameraReady, handleCapturar, handleSalvarNota, resetScanner, toggleFlash
  } = useEscanearGabarito();

  if (!permission?.granted) {
    return (
      <View style={styles.containerCenter}>
        <TouchableOpacity style={styles.btnPermissao} onPress={requestPermission}>
          <Text style={styles.btnText}>ATIVAR CÂMERA</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      
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

      {loading && <ScannerLoading text="Processando Gabarito..." />}

      {/* Overlay Interativo */}
      <View style={styles.overlay} pointerEvents="box-none">
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.btnIcon} onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnIcon} onPress={toggleFlash}>
            <Ionicons name={flash ? "flashlight" : "flashlight-outline"} size={26} color={flash ? "#FFD700" : "#FFF"} />
          </TouchableOpacity>
        </View>

        {/* Guia de Enquadramento */}
        <View style={styles.viewfinder} pointerEvents="none">
          <View style={[styles.guideFrame, isDetected && styles.frameActive]} />
        </View>

        {/* Footer: Botão de Captura OU Card de Resultado */}
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
            <ScannerResultCard 
              result={scannedResult}
              onSave={handleSalvarNota}
              onDiscard={resetScanner}
            />
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  containerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
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
});