import { View, Text, FlatList, Pressable } from 'react-native';
import { useCollection } from '../../hooks/useCollection';
import { formatCents } from '../../utils/helpers';
import { router } from 'expo-router';

export default function CollectionScreen() {
  const { cards, removeCard } = useCollection();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.user_card_id}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderBottomWidth: 1, gap: 4 }}>
            <Text style={{ fontWeight: '600' }}>{item.card_print.name}</Text>
            <Text>{item.card_print.set_code} • {item.condition}</Text>
            <Text>{formatCents((item.purchase_price_cents || 0) * item.quantity)}</Text>
            <Pressable
              onPress={() => removeCard(item.user_card_id)}
              style={{ marginTop: 8, alignSelf: 'flex-start' }}
            >
              <Text style={{ color: '#dc2626' }}>Remove</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text>No cards yet. Open scan to add.</Text>}
      />
    </View>
  );
}
