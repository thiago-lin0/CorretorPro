import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../constants/Theme';

interface ProvaCardProps { item: any; onEdit: () => void; onDownloadPress: () => void; onDelete: () => void; }

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
          <Ionicons name="cloud-download-outline" size={24} color={COLORS.primary} style={{ marginRight: 15 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash-outline" size={22} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export function DownloadModal({ visible, prova, onClose, onDownload }: any) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBody}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Gerar Gabaritos</Text>
          {prova?.tb_aplicacao_prova?.map((v: any) => (
            <TouchableOpacity key={v.id_turma} style={styles.btnDownloadOption} onPress={() => onDownload(v.id_turma, prova.id_prova)}>
              <Text style={styles.btnDownloadText}>{v.tb_turma?.serie}º {v.tb_turma?.turma}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.btnClose} onPress={onClose}><Text style={{color: COLORS.surface}}>Cancelar</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  cardLista: { flexDirection: 'row', backgroundColor: COLORS.surface, padding: 16, borderRadius: SIZES.radiusMedium, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', elevation: 2 },
  infoBox: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.textPrimary },
  cardMateria: { fontSize: 11, color: COLORS.primary, fontWeight: 'bold', marginBottom: 2 },
  cardTurma: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  modalBody: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLarge, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: COLORS.textPrimary },
  btnDownloadOption: { backgroundColor: COLORS.borderLight, padding: 15, borderRadius: SIZES.radiusMedium, marginBottom: 8 },
  btnDownloadText: { color: COLORS.primary, fontWeight: 'bold', textAlign: 'center' },
  btnClose: { backgroundColor: COLORS.textSecondary, padding: 12, borderRadius: SIZES.radiusSmall, alignItems: 'center', marginTop: 10 }
});