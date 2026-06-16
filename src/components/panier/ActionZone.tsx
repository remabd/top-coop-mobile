import { Text, View, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { panierSelector } from '../../store/panierSlice';
import { useNavigation } from '@react-navigation/native';
import { demandeValidationPanier } from '../../api/panier.api';
import { COLORS, RADIUS, SPACING, TEXTE } from '../../STYLE_CONSTS';
import { DtoVersPanierUtilisateur } from '../../models/panier.type';

export function ActionZone() {
  const panier = useSelector(panierSelector);
  const navigation = useNavigation<any>();
  const panierVide = panier.produits.length === 0;

  async function validePanier() {
    const data: DtoVersPanierUtilisateur = {
      prix: panier.prix,
      produits: [],
    };
    panier.produits.forEach((p) => {
      data.produits.push({
        typeProduitId: p.typeProduit.id,
        quantite: p.quantite,
      });
    });
    const response = await demandeValidationPanier(data);
    if (!response.ok) {
      //TODO TOAS
      return;
    }
    //TODO TOAST
  }

  return (
    <View style={styles.zone}>
      <View style={styles.totalLigne}>
        <Text style={styles.totalLabel}>Prix total du panier</Text>
        <Text style={styles.totalPrix}>{panier.prix}€</Text>
      </View>

      <View style={styles.boutons}>
        <Pressable
          style={[styles.valider, panierVide && styles.desactive]}
          onPress={validePanier}
          disabled={panierVide}
        >
          <Text style={styles.validerTexte}>Valider le panier</Text>
        </Pressable>
        <Pressable
          style={styles.scan}
          onPress={() => navigation.navigate('camera')}
        >
          <MaterialIcons
            name="qr-code-scanner"
            size={20}
            color={COLORS.blanc}
          />
          <Text style={styles.scanTexte}>Scan</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  zone: {
    borderTopWidth: 1,
    borderTopColor: COLORS.bordure,
    paddingTop: SPACING.md,
    gap: SPACING.md,
  },
  totalLigne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...TEXTE.corps,
  },
  totalPrix: {
    ...TEXTE.corpsFort,
  },
  boutons: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.md,
  },
  valider: {
    flex: 1,
    backgroundColor: COLORS.orange,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desactive: {
    opacity: 0.5,
  },
  validerTexte: {
    ...TEXTE.corpsFort,
    color: COLORS.blanc,
  },
  scan: {
    backgroundColor: COLORS.orange,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  scanTexte: {
    ...TEXTE.corpsFort,
    color: COLORS.blanc,
  },
});
