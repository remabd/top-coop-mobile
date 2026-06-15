import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACING, TEXTE } from '../../STYLE_CONSTS';
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
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  separateur: {
    height: SPACING.sm,
  },
  nom: {
    ...TEXTE.corpsFort,
    flex: 1,
  },
  date: {
    ...TEXTE.corps,
    marginHorizontal: 10,
  },
  prix: {
    ...TEXTE.corpsFort,
    minWidth: 32,
    textAlign: 'right',
  },
  vide: TEXTE.discret,
  voirPlus: {
    alignSelf: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  voirPlusTexte: {
    ...TEXTE.titreSection,
    color: COLORS.vert_fonce,
  },
});
