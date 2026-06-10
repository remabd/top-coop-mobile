import { Button, Text, View } from 'react-native';
import { ProduitPanier, Unite } from '../../models/panier.type';

export function ProductCard(props: {
  produit: ProduitPanier;
  supprimeProduit: (id: string) => void;
  modifieQuantite: (id: string, quantite: number) => void;
}) {
  return (
    <View>
      <Text>{props.produit.nom}</Text>
      {props.produit.unite === Unite.UNITE ? <View></View> : <View></View>}
      <Text>{props.produit.prix * props.produit.quantite}€</Text>
      <Button
        title="Supprimer"
        onPress={() => props.supprimeProduit(props.produit.id)}
      />
    </View>
  );
}
