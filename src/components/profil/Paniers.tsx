import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Panier } from '../../models/panier.type';
import { Accordeon } from '../Accordeon';
import { COLORS } from '../../CONST';

export function Paniers(props: { paniers: Panier[] }) {
  const paniers = props.paniers;

  const body = (
    <FlatList
      data={paniers}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View style={styles.ligne}>
          <Text style={styles.nom} numberOfLines={1}>
            Panier {item.id}
          </Text>
          <Text style={styles.date}>
            {item.dateCreation
              ? new Date(item.dateCreation).toLocaleDateString()
              : ''}
          </Text>
          <Text style={styles.prix}>{item.prix}€</Text>
        </View>
      )}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={styles.separateur} />}
      ListEmptyComponent={<Text style={styles.vide}>Aucun paniers</Text>}
    />
  );

  return <Accordeon title="Mes paniers" body={body} />;
}

const styles = StyleSheet.create({
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.vert_clair,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  separateur: {
    height: 8,
  },
  nom: {
    flex: 1,
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
    color: COLORS.texte,
  },
  date: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: COLORS.texte,
    marginHorizontal: 10,
  },
  prix: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
    color: COLORS.texte,
    minWidth: 32,
    textAlign: 'right',
  },
  vide: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: COLORS.placeholder,
  },
});
