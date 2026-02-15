import { Ionicons } from '@expo/vector-icons'; // Ícones
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#0070C0' }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      {/* Amanhã criaremos a camera.tsx e turmas.tsx aqui */}
    </Tabs>
  );
}