import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* A tela index (Login) será a primeira a aparecer */}
      <Stack.Screen name="index" />
      {/* A pasta (tabs) será carregada quando o usuário logar */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}