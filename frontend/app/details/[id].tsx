import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { getFairMarketPrice } from '../../hooks/useCollection';

type Props = { cardPrintId: string; name: string; setCode: string; cardNumber: string };

export default function CardDetails({ cardPrintId, name, setCode, cardNumber }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.meta}>{setCode} • {cardNumber}</Text>
      <Image
        source={{ uri: `https://images.pokemontcg.io/${setCode.toLowerCase()}/${cardNumber.split('/')[0]}.png` }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.footer}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  meta: { color: '#6b7280' },
  image: { width: '100%', height: 280, borderRadius: 12, backgroundColor: '#f3f4f6' },
  footer: { marginTop: 12 },
});
