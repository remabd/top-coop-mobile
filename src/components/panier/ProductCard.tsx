import { Text, View, Pressable, Modal, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TypeProduitVersPanierProduit, Unite } from '../../models/panier.type';
import { useState } from 'react';
import { COLORS, RADIUS, SPACING, TEXTE } from '../../STYLE_CONSTS';
import { ProduitQuantite } from './ProduitQuantite';

export function ProductCard(props: {
  produit: TypeProduitVersPanierProduit;
  index: number;
  supprimeProduit: (id: string) => void;
  modifieQuantite: (id: string, quantite: number) => void;
}) {
  const produit = props.produit;
  const estUnite = produit.unite === Unite.UNITE;
  const [visible, setVisible] = useState<boolean>(false);
  const [quantiteAValider, setQuantiteAValider] = useState<number>(
    produit.quantite
  );

  function valide() {
    if (Number.isNaN(quantiteAValider) || quantiteAValider <= 0) return;
    props.modifieQuantite(produit.typeProduit.id, quantiteAValider);
    setVisible(false);
  }

  function changeQuantite(delta: number) {
    const nouvelle = produit.quantite + delta;
    if (nouvelle <= 0) return;
    props.modifieQuantite(produit.typeProduit.id, nouvelle);
  }

  const fondLigne =
    props.index % 2 === 0 ? COLORS.vert_clair : COLORS.vert_clair_60;

  return (
    <View style={[styles.ligne, { backgroundColor: fondLigne }]}>
      <Pressable style={styles.infos} onPress={() => setVisible(true)}>
        <Text style={styles.nom}>{produit.typeProduit.nom}</Text>
        {estUnite ? (
          <View style={styles.stepper}>
            <Pressable onPress={() => changeQuantite(-1)} hitSlop={8}>
              <MaterialIcons name="remove" size={18} color={COLORS.texte} />
            </Pressable>
            <Text style={styles.quantite}>x{produit.quantite}</Text>
            <Pressable onPress={() => changeQuantite(1)} hitSlop={8}>
              <MaterialIcons name="add" size={18} color={COLORS.texte} />
            </Pressable>
          </View>
        ) : (
          <Text style={styles.poids}>{produit.quantite}Kg</Text>
        )}
      </Pressable>

      <View style={styles.droite}>
        <Text style={styles.prix}>{produit.prix * produit.quantite}€</Text>
        <Pressable
          onPress={() => props.supprimeProduit(produit.typeProduit.id)}
          hitSlop={8}
        >
          <MaterialIcons
            name="remove-circle-outline"
            size={24}
            color={COLORS.vert_fonce}
          />
        </Pressable>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.carte} onPress={() => {}}>
            <ProduitQuantite
              produit={produit}
              onChangeQuantite={setQuantiteAValider}
            />
            <View style={styles.boutons}>
              <Pressable
                style={[styles.bouton, styles.boutonAnnuler]}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.boutonTexte}>Annuler</Text>
              </Pressable>
              <Pressable
                style={[styles.bouton, styles.boutonValider]}
                onPress={valide}
              >
                <Text style={styles.boutonTexte}>Ajouter</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  infos: {
    flex: 1,
    gap: SPACING.xs,
  },
  nom: {
    ...TEXTE.corpsFort,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  quantite: {
    ...TEXTE.corps,
  },
  poids: {
    ...TEXTE.corpsFort,
    color: COLORS.orange,
  },
  droite: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  prix: {
    ...TEXTE.corpsFort,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: SPACING.xl,
  },
  carte: {
    width: '85%',
    backgroundColor: COLORS.blanc,
    borderRadius: RADIUS.lg,
    padding: SPACING.xxl,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  boutons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  bouton: {
    flex: 1,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  boutonAnnuler: {
    backgroundColor: COLORS.vert_fonce,
  },
  boutonValider: {
    backgroundColor: COLORS.orange,
  },
  boutonTexte: {
    ...TEXTE.corpsFort,
    color: COLORS.blanc,
  },
});
