import { Button, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { panierSelector } from '../../store/panierSlice';
import { useNavigation } from '@react-navigation/native';

export function ActionZone() {
  const panier = useSelector(panierSelector);
  const navigation = useNavigation<any>();

  function validePanier() {}
  return (
    <View>
      <View>
        <Text>Prix total du panier</Text>
        <Text>{panier.prix}€</Text>
      </View>
      <View>
        <Button title="Valider le panier" onPress={validePanier} />
        <Button
          title="scan"
          onPress={() => {
            navigation.navigate('camera');
          }}
        />
      </View>
    </View>
  );
}
