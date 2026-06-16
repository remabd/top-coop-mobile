import { View, Text, Button, TextInput } from 'react-native';
import { TypeProduitVersPanierProduit, Unite } from '../../models/panier.type';
import { useState } from 'react';

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
    props.onChangeQuantite(quantite);
  }

  return (
    <View>
      <Text>{produit.typeProduit.nom}</Text>
      <TextInput
        placeholder={estVrac ? 'Poids' : 'Quantité'}
        keyboardType={estVrac ? 'decimal-pad' : 'number-pad'}
        value={nouvelleQuantite}
        onChangeText={onChange}
      ></TextInput>
    </View>
  );
}
