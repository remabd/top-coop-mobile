import { FlatList, View, Text, Button } from 'react-native';
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
        keyExtractor={(item) => item.typeProduit.id}
        ListEmptyComponent={<Text>Aucun produit</Text>}
      />
      <ActionZone />
    </View>
  );
}
