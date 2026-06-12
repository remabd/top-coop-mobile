import { FlatList, View, Text, Button } from 'react-native';
import { Panier, ProduitPanier } from '../models/panier.type';
import { useDispatch, useSelector } from 'react-redux';
import { modifiePanier, panierSelector } from '../store/panierSlice';
import { AppDispatch } from '../store/store';
import { ProductCard } from '../components/panier/ProductCard';
import { useNavigation } from '@react-navigation/native';
import { ActionZone } from '../components/panier/ActionZone';

export function PanierScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const panier = useSelector(panierSelector);

  function supprimeUnProduit(id: string): void {
    const produits = panier.produits.filter((p) => p.id !== id);
    dispatch(modifiePanier(recalculePanier(produits)));
  }

  function modifieQuantite(id: string, quantite: number): void {
    const produits = panier.produits.map((p) =>
      p.id === id ? { ...p, quantite } : p
    );
    dispatch(modifiePanier(recalculePanier(produits)));
  }

  function recalculePanier(produits: ProduitPanier[]): Panier {
    return {
      ...panier,
      produits,
      prix: produits.reduce((total, p) => total + p.prix * p.quantite, 0),
    };
  }

  return (
    <View style={{ paddingTop: 30 }}>
      <Text>Panier</Text>
      <Button
        title="voir les produits"
        onPress={() => {
          navigation.navigate('catalogue');
        }}
      />
      <FlatList
        renderItem={({ item }) => (
          <ProductCard
            produit={item}
            modifieQuantite={modifieQuantite}
            supprimeProduit={supprimeUnProduit}
          />
        )}
        data={panier.produits}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>Aucun produit</Text>}
      />
      <ActionZone />
    </View>
  );
}
