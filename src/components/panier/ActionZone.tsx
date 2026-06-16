import { Button, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { panierSelector } from '../../store/panierSlice';
import { useNavigation } from '@react-navigation/native';
import { demandeValidationPanier } from '../../api/panier.api';

export function ActionZone() {
  const panier = useSelector(panierSelector);
  const navigation = useNavigation<any>();

  async function validePanier() {
    const response = await demandeValidationPanier(panier);
    if (!response.ok) {
      //TODO TOAS
      return;
    }
    //TODO TOAST
  }

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
