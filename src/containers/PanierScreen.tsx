import { FlatList, View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { modifiePanier, panierSelector } from '../store/panierSlice';
import { AppDispatch } from '../store/store';
import { ProductCard } from '../components/panier/ProductCard';
import { useNavigation } from '@react-navigation/native';
import { ActionZone } from '../components/panier/ActionZone';
import {
  COLORS,
  FONTS_OUTFIT,
  FONT_SIZE,
  RADIUS,
  SPACING,
  TEXTE,
} from '../STYLE_CONSTS';

export function PanierScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const panier = useSelector(panierSelector);
  const panierVide = panier.produits.length === 0;

  function supprimeUnProduit(id: string): void {
    const produit = panier.produits.find((p) => p.typeProduit.id === id);
    if (!produit) return;
    const produitsRestants = panier.produits.filter(
      (p) => p.typeProduit.id !== id
    );
    dispatch(
      modifiePanier({
        prix: panier.prix - produit?.prix,
        produits: produitsRestants,
      })
    );
    //TOAST ?
  }

  function modifieQuantite(id: string, quantite: number): void {
    const produits = panier.produits.map((p) =>
      p.typeProduit.id === id ? { ...p, quantite } : p
    );
    const prix = panier.produits.reduce((total, p) => total + p.prix, 0);
    dispatch(
      modifiePanier({
        prix,
        produits,
      })
    );
    //TOAST ?
  }

  function voirProduits() {
    navigation.navigate('catalogue');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Panier</Text>

      {panierVide ? (
        <View style={styles.vide}>
          <Text style={styles.videTexte}>
            Votre panier est actuellement vide.
          </Text>
          <Text style={styles.videTexte}>
            Ajoutez un produit en scannant le code barre
          </Text>
          <Pressable
            style={styles.scanProduit}
            onPress={() => navigation.navigate('camera')}
          >
            <MaterialIcons
              name="qr-code-scanner"
              size={28}
              color={COLORS.blanc}
            />
            <Text style={styles.scanProduitTexte}>Scanner un produit</Text>
          </Pressable>
          <Pressable style={styles.lien} onPress={voirProduits}>
            <MaterialIcons name="inventory-2" size={16} color={COLORS.texte} />
            <Text style={styles.lienTexte}>Voir les produits</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <Pressable style={styles.lien} onPress={voirProduits}>
            <MaterialIcons name="inventory-2" size={16} color={COLORS.texte} />
            <Text style={styles.lienTexte}>Voir les produits</Text>
          </Pressable>
          <FlatList
            style={styles.liste}
            renderItem={({ item, index }) => (
              <ProductCard
                produit={item}
                index={index}
                modifieQuantite={modifieQuantite}
                supprimeProduit={supprimeUnProduit}
              />
            )}
            data={panier.produits}
            keyExtractor={(item) => item.typeProduit.id}
          />
        </>
      )}

      <ActionZone />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blanc,
    marginTop: 30,
    paddingTop: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  titre: {
    fontFamily: FONTS_OUTFIT.bold,
    fontSize: FONT_SIZE.titre,
    color: COLORS.orange,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  lien: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  lienTexte: {
    ...TEXTE.corps,
    textDecorationLine: 'underline',
  },
  liste: {
    flex: 1,
  },
  vide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  videTexte: {
    ...TEXTE.corpsFort,
    textAlign: 'center',
  },
  scanProduit: {
    backgroundColor: COLORS.orange,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    gap: SPACING.xs,
    marginVertical: SPACING.lg,
  },
  scanProduitTexte: {
    ...TEXTE.corpsFort,
    color: COLORS.blanc,
  },
});