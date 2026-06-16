import { Button, Text, View, Pressable, Modal, StyleSheet } from 'react-native';
import { TypeProduitVersPanierProduit, Unite } from '../../models/panier.type';
import { useState } from 'react';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from '../../STYLE_CONSTS';
import { ProduitQuantite } from './ProduitQuantite';

export function ProductCard(props: {
  produit: TypeProduitVersPanierProduit;
  supprimeProduit: (id: string) => void;
  modifieQuantite: (id: string, quantite: number) => void;
}) {
  const [visible, setVisible] = useState<boolean>(false);
  const [quantiteAValider, setQuantiteAValider] = useState<number>(
    props.produit.quantite
  );

  function valide() {
    if (Number.isNaN(quantiteAValider) || quantiteAValider <= 0) return;
    props.modifieQuantite(props.produit.typeProduit.id, quantiteAValider);
    setVisible(false);
  }

  return (
    <View>
      <Pressable onPress={() => setVisible(true)}>
        <Text>{props.produit.typeProduit.nom}</Text>
        {props.produit.unite === Unite.UNITE ? (
          <Text>x {props.produit.quantite}</Text>
        ) : (
          <Text>{props.produit.quantite} Kg</Text>
        )}
        <Text>{props.produit.prix * props.produit.quantite}€</Text>
      </Pressable>
      <Button
        title="Supprimer"
        onPress={() => props.supprimeProduit(props.produit.typeProduit.id)}
      />
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.carte} onPress={() => {}}>
            <ProduitQuantite
              produit={props.produit}
              onChangeQuantite={setQuantiteAValider}
            />
            <Pressable style={styles.boutonFermer} onPress={valide}>
              <Text style={styles.boutonFermerTexte}>Valider</Text>
            </Pressable>
            <Pressable
              style={styles.boutonFermer}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.boutonFermerTexte}>Fermer</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

//TODO Centraliser les styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boutonFermer: {
    backgroundColor: COLORS.vert_fonce,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  boutonFermerTexte: {
    fontFamily: FONTS.semibold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.blanc,
  },
  carte: {
    width: '85%',
    backgroundColor: COLORS.blanc,
    borderRadius: RADIUS.lg,
    padding: SPACING.xxl,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});
