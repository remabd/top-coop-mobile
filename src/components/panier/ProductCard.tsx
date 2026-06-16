import { Button, Text, View } from 'react-native';
import {
  TypeProduitVersPanierProduit,
  Unite,
} from '../../models/panier.type';

export function ProductCard(props: {
  produit: TypeProduitVersPanierProduit;
  supprimeProduit: (id: string) => void;
  modifieQuantite: (id: string, quantite: number) => void;
}) {
  return (
    <View>
      <Text>{props.produit.typeProduit.nom}</Text>
      {props.produit.unite === Unite.UNITE ? <View></View> : <View></View>}
      <Text>{props.produit.prix * props.produit.quantite}€</Text>
      <Button
        title="Supprimer"
        onPress={() => props.supprimeProduit(props.produit.typeProduit.id)}
      />
    </View>
  );
}
