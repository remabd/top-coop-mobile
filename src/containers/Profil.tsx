import { Button, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { deconnexion } from '../store/authSlice';
import { clear } from '../store/securetoken';

export function Profil(props: any) {
  const dispatch = useDispatch();

  async function deconnecte() {
    await clear();
    dispatch(deconnexion());
  }

  return (
    <View>
      <Button title="Se déconnecter" onPress={deconnecte} />
    </View>
  );
}
