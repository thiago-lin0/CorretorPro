import React from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DescritorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (descritor: string) => void;
}

export function DescritorModal({ visible, onClose, onSelect }: DescritorModalProps) {
  const listaDescritores = Array.from({ length: 37 }, (_, i) => `D${i + 1}`);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalScrollContent}>
          <Text style={styles.modalTitle}>Selecione o Descritor</Text>
          <FlatList 
            data={listaDescritores} 
            keyExtractor={(i) => i} 
            numColumns={4} 
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.dItem} onPress={() => onSelect(item)}>
                <Text style={styles.dText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={onClose} style={styles.btnClose}>
            <Text style={{ color: '#FFF' }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalScrollContent: { backgroundColor: '#FFF', borderRadius: 25, padding: 20, maxHeight: '80%' },
  modalTitle: { textAlign:'center', fontWeight:'bold', marginBottom:20 },
  dItem: { margin: 5, padding: 15, backgroundColor: '#F0F4FF', borderRadius: 10, flex:1, alignItems:'center' },
  dText: { color: '#003399', fontWeight: 'bold' },
  btnClose: { backgroundColor: '#003399', padding: 15, borderRadius: 15, alignItems: 'center', marginTop:10 }
});