import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

// IMPORTAMOS O NOSSO TEMA AQUI!
import { COLORS, SIZES } from '../constants/Theme';

interface AuthInputProps extends TextInputProps {
  label: string;
}

export function AuthInput({ label, ...props }: AuthInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={COLORS.textLight} // Usando a cor do tema
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    width: '100%', 
    marginBottom: SIZES.base // Usando o espaçamento do tema
  },
  label: { 
    fontSize: 14, 
    color: COLORS.textPrimary, // Usando a cor do tema
    fontWeight: '700', 
    marginBottom: SIZES.base, 
    marginTop: SIZES.small 
  },
  input: { 
    backgroundColor: COLORS.borderLight, 
    borderRadius: SIZES.radiusMedium, 
    padding: 14, 
    fontSize: 16, 
    color: COLORS.textPrimary, 
    borderWidth: 1, 
    borderColor: COLORS.border 
  },
});