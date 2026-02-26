import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProvaCardProps {
  item: any;
  onEdit: () => void;
  onDownloadPress: () => void;
  onDelete: () => void;
}

export function ProvaCard({ item, onEdit, onDownloadPress, onDelete }: ProvaCardProps) {
  return (
    <TouchableOpacity style={styles.cardLista} onPress={onEdit}>
      <View style={styles.infoBox}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <Text style={styles.cardMateria}>{item.materia === 'MAT' ? '📐 Matemática' : '📚 Português'}</Text>
        <Text style={styles.cardTurma}>{item.tb_aplicacao_prova?.length || 0} turmas • {item.qtd_questoes} questões</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onDownloadPress}>
          <Ionicons name="cloud-download-outline" size={24} color="#003399" style={{ marginRight: 15 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash-outline" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

interface DownloadModalProps {
  visible: boolean;
  prova: any;
  onClose: () => void;
  onDownload: (idTurma: number, idProva: number) => void;
}

export function DownloadModal({ visible, prova, onClose, onDownload }: DownloadModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBody}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Gerar Gabaritos</Text>
          {prova?.tb_aplicacao_prova?.map((v: any) => (
            <TouchableOpacity 
              key={v.id_turma} 
              style={styles.btnDownloadOption} 
              onPress={() => onDownload(v.id_turma, prova.id_prova)}
            >
              <Text style={styles.btnDownloadText}>{v.tb_turma?.serie}º {v.tb_turma?.turma}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.btnClose} onPress={onClose}>
            <Text style={{color:'#FFF'}}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  cardLista: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  infoBox: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  cardMateria: { fontSize: 11, color: '#003399', fontWeight: 'bold', marginBottom: 2 },
  cardTurma: { fontSize: 12, color: '#64748B', marginTop: 2 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  modalBody: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  btnDownloadOption: { backgroundColor: '#F1F5F9', padding: 15, borderRadius: 12, marginBottom: 8 },
  btnDownloadText: { color: '#003399', fontWeight: 'bold', textAlign: 'center' },
  btnClose: { backgroundColor: '#666', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 10 }
});