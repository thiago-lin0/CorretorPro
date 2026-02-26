import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../constants/Theme';

// --- MODAL TURMA ---
export function ModalNovaTurma({ visible, onClose, onSave, serie, setSerie, turmaLetra, setTurmaLetra, turno, setTurno }: any) {
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Nova Turma</Text>
          <TextInput style={styles.input} placeholder="Série (Ex: 8)" keyboardType="numeric" value={serie} onChangeText={setSerie} />
          <TextInput style={styles.input} placeholder="Turma (Ex: B)" maxLength={1} value={turmaLetra} onChangeText={setTurmaLetra} />
          
          <Text style={styles.label}>Turno:</Text>
          <View style={styles.shiftContainer}>
            {['Manhã', 'Tarde', 'Noite'].map((t) => (
              <TouchableOpacity key={t} style={[styles.shiftBtn, turno === t && styles.shiftBtnActive]} onPress={() => setTurno(t)}>
                <Text style={[styles.shiftBtnText, turno === t && styles.shiftBtnTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.btnSave} onPress={onSave}>
            <Text style={styles.btnTextSave}>Criar Turma</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// --- MODAL ALUNO ---
export function ModalGerenciarAluno(props: any) {
  const {
    visible, onClose, onSave, onImport, modo, setModo,
    nome, setNome, idTurma, setIdTurma, turmas, turmaObj,
    dropdownAberto, setDropdownAberto, importando
  } = props;

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          <View style={styles.modeSelector}>
            <TouchableOpacity style={[styles.modeBtn, modo === 'manual' && styles.modeBtnActive]} onPress={() => setModo('manual')}>
              <Text style={[styles.modeBtnText, modo === 'manual' && styles.modeBtnTextActive]}>Individual</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modeBtn, modo === 'excel' && styles.modeBtnActive]} onPress={() => setModo('excel')}>
              <Text style={[styles.modeBtnText, modo === 'excel' && styles.modeBtnTextActive]}>Em Massa (Excel)</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>1. Turma:</Text>
          <TouchableOpacity style={[styles.dropdownButton, dropdownAberto && styles.dropdownButtonActive]} onPress={() => setDropdownAberto(!dropdownAberto)}>
            <Text style={styles.dropdownButtonText}>{idTurma ? `${turmaObj?.serie}º ${turmaObj?.turma}` : "Selecione a Turma"}</Text>
            <Ionicons name={dropdownAberto ? "chevron-up" : "chevron-down"} size={20} color="#666" />
          </TouchableOpacity>

          {dropdownAberto && (
            <View style={styles.dropdownList}>
              <ScrollView style={{ maxHeight: 120 }}>
                {turmas.map((t: any) => (
                  <TouchableOpacity key={t.id_turma} style={styles.dropdownItem} onPress={() => { setIdTurma(t.id_turma); setDropdownAberto(false); }}>
                    <Text style={styles.dropdownItemText}>{t.serie}º {t.turma} - {t.turno}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={{ height: 25 }} />

          {modo === 'manual' ? (
            <View>
              <Text style={styles.label}>2. Nome do Aluno:</Text>
              <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />
              <TouchableOpacity style={styles.btnSave} onPress={onSave}>
                <Text style={styles.btnTextSave}>Salvar Aluno</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={20} color="#003399" />
                <Text style={styles.infoText}>O Excel deve conter os nomes na primeira coluna (coluna A).</Text>
              </View>
              <TouchableOpacity style={styles.btnExcelLarge} onPress={onImport} disabled={importando}>
                {importando ? <ActivityIndicator color="#FFF" /> : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={24} color="#FFF" style={{marginRight: 10}} />
                    <Text style={styles.btnTextSave}>Selecionar Arquivo .xlsx</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity onPress={onClose} style={{marginTop: 20}}>
            <Text style={styles.cancelText}>Cancelar e Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Estilos apenas dos Modais
const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: COLORS.overlay, 
    justifyContent: 'center', 
    padding: 25 
  },
  modalContent: { 
    backgroundColor: COLORS.surface, 
    borderRadius: 30, // Mantive 30 aqui pois é um modal bem arredondado
    padding: 30 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: COLORS.primary, 
    marginBottom: 20 
  },
  input: { 
    backgroundColor: COLORS.background, 
    padding: 15, 
    borderRadius: SIZES.radiusMedium, 
    marginBottom: 15 
  },
  label: { 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: COLORS.textSecondary, 
    fontSize: 13 
  },
  btnSave: { 
    backgroundColor: COLORS.primaryDark, 
    padding: 18, 
    borderRadius: 18, 
    alignItems: 'center', 
    marginBottom: 15 
  },
  btnTextSave: { 
    color: COLORS.surface, 
    fontWeight: 'bold' 
  },
  cancelText: { 
    textAlign: 'center', 
    color: COLORS.textLight 
  },
  shiftContainer: { 
    flexDirection: 'row', 
    gap: 10, 
    marginBottom: 20 
  },
  shiftBtn: { 
    flex: 1, 
    padding: 12, 
    backgroundColor: COLORS.background, 
    borderRadius: SIZES.radiusSmall, 
    alignItems: 'center' 
  },
  shiftBtnActive: { 
    backgroundColor: COLORS.borderLight, 
    borderWidth: 1, 
    borderColor: COLORS.primaryDark 
  },
  shiftBtnText: { 
    color: COLORS.textSecondary, 
    fontWeight: 'bold' 
  },
  shiftBtnTextActive: { 
    color: COLORS.primary 
  },
  modeSelector: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.background, 
    borderRadius: SIZES.radiusMedium, 
    padding: 4, 
    marginBottom: 25 
  },
  modeBtn: { 
    flex: 1, 
    paddingVertical: 10, 
    alignItems: 'center', 
    borderRadius: SIZES.radiusSmall 
  },
  modeBtnActive: { 
    backgroundColor: COLORS.surface, 
    elevation: 2 
  },
  modeBtnText: { 
    color: COLORS.textLight, 
    fontWeight: 'bold', 
    fontSize: 12 
  },
  modeBtnTextActive: { 
    color: COLORS.primaryDark 
  },
  dropdownButton: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: COLORS.background, 
    padding: 15, 
    borderRadius: SIZES.radiusMedium 
  },
  dropdownButtonActive: { 
    borderWidth: 1, 
    borderColor: COLORS.primaryDark 
  },
  dropdownButtonText: { 
    color: COLORS.textPrimary 
  },
  dropdownList: { 
    backgroundColor: COLORS.surface, 
    borderRadius: SIZES.radiusMedium, 
    marginTop: 5, 
    elevation: 4 
  },
  dropdownItem: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.borderLight 
  },
  dropdownItemText: { 
    color: COLORS.textSecondary 
  },
  infoBox: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.borderLight, 
    padding: 15, 
    borderRadius: SIZES.radiusMedium, 
    marginBottom: 20, 
    alignItems: 'center' 
  },
  infoText: { 
    color: COLORS.primary, 
    fontSize: 12, 
    flex: 1, 
    marginLeft: 10 
  },
  btnExcelLarge: { 
    backgroundColor: COLORS.successDark, // Aquele verde bonito
    flexDirection: 'row', 
    padding: 20, 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center' 
  }
});