import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TypeProduitVersPanierProduit, Unite } from '../../models/panier.type';
import { useState } from 'react';
import { COLORS, RADIUS, SPACING, TEXTE } from '../../STYLE_CONSTS';

export function ProduitQuantite(props: {
  produit: TypeProduitVersPanierProduit;
  onChangeQuantite: (quantite: number) => void;
}) {
  const produit = props.produit;
  const estVrac = produit.unite === Unite.VRAC;
  const [nouvelleQuantite, setNouvellequantite] = useState<string>(
    produit.quantite.toString()
  );

  function onChange(texte: string) {
    const nettoye = estVrac
      ? texte.replace(',', '.').replace(/[^0-9.]/g, '')
      : texte.replace(/[^0-9]/g, '');
    setNouvellequantite(nettoye);

    const quantite = estVrac ? parseFloat(nettoye) : parseInt(nettoye, 10);
    // remonte la valeur saisie (NaN si champ vide/invalide) au parent,
    // qui décidera de valider via son bouton
    props.onChangeQuantite(quantite);
  }

  function vide() {
    setNouvellequantite('');
    props.onChangeQuantite(NaN);
  }

  return (
    <View>
      <Text style={styles.titre}>{produit.typeProduit.nom}</Text>
      <View style={styles.champ}>
        <TextInput
          style={styles.saisie}
          placeholder={estVrac ? 'Poids' : 'Quantité'}
          placeholderTextColor={COLORS.placeholder}
          keyboardType={estVrac ? 'decimal-pad' : 'number-pad'}
          value={nouvelleQuantite}
          onChangeText={onChange}
        />
        {nouvelleQuantite.length > 0 && (
          <Pressable onPress={vide} hitSlop={8}>
            <MaterialIcons name="close" size={20} color={COLORS.placeholder} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titre: {
    ...TEXTE.titreModal,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  champ: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.vert_clair,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
  },
  saisie: {
    ...TEXTE.corps,
    flex: 1,
    paddingVertical: SPACING.md,
  },
});
