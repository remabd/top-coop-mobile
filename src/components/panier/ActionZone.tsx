import { Button, Text, View } from 'react-native';
import { Panier } from '../../models/panier.type';
import { useSelector } from 'react-redux';
import { panierSelector } from '../../store/panierSlice';

export function ActionZone() {
  const panier = useSelector(panierSelector);

  function validePanier() {}
  return (
    <View>
      <View>
        <Text>Prix total du panier</Text>
        <Text>{panier.prix}€</Text>
      </View>
      <View>
        <Button title="Valider le panier" onPress={validePanier} />
        <Button title="scan" onPress={() => {}} />
      </View>
    </View>
  );
}
