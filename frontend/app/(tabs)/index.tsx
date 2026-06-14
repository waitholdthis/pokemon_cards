import { View, Text, Pressable } from 'react-native';
import { useCollection } from '../../hooks/useCollection';
import { formatCents } from '../../utils/helpers';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { cards, totalValueCents } = useCollection();

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Collection Value</Text>
      <Text style={{ fontSize: 32 }}>{formatCents(totalValueCents())}</Text>
      <Text>{cards.length} cards</Text>
      <Pressable
        onPress={() => router.push('/collection')}
        style={{ padding: 10, backgroundColor: '#16a34a', borderRadius: 8 }}
      >
        <Text style={{ color: '#fff' }}>Go to Collection</Text>
      </Pressable>
    </View>
  );
}
