import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function ScanScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text>Camera placeholder</Text>
      <Pressable
        onPress={() => router.push('/details/[id]')}
        style={{ padding: 10, backgroundColor: '#0ea5e9', borderRadius: 8 }}
      >
        <Text style={{ color: '#fff' }}>Open card detail placeholder</Text>
      </Pressable>
    </View>
  );
}
