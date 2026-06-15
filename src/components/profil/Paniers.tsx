import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../CONST';
import { Panier } from '../../models/panier.type';
import { Accordeon } from '../Accordeon';

export function Paniers(props: { paniers: Panier[] }) {
  const paniers = props.paniers;
  const [tous, setTous] = useState<boolean>(false);

  const body = (
    <>
      <FlatList
        data={tous ? paniers : paniers.slice(0, 6)}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.ligne}>
            <Text style={styles.date}>
              {item.dateCreation
                ? 'Le ' + new Date(item.dateCreation).toLocaleDateString()
                : ''}
            </Text>
            <Text>
              À {new Date(item.dateCreation).toLocaleTimeString().slice(0, 5)}
            </Text>
            <Text style={styles.prix}>{item.prix}€</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separateur} />}
        ListEmptyComponent={<Text style={styles.vide}>Aucun paniers</Text>}
      />
      <Pressable
        style={styles.voirPlus}
        onPress={() => setTous((t) => !t)}
        hitSlop={8}
      >
        <Text style={styles.voirPlusTexte}>
          {tous ? 'Voir moins' : 'Voir plus'}
        </Text>
      </Pressable>
    </>
  );

  return <Accordeon title="Mes paniers" body={body} />;
}

const styles = StyleSheet.create({
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  voirPlus: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  voirPlusTexte: {
    fontFamily: 'Outfit_600SemiBold',
    fontWeight: 'bold',
    fontSize: 15,
    color: COLORS.vert_fonce,
    fontStyle: 'italic',
  },
});
