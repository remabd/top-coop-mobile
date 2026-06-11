import { useEffect, useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { AuthApi } from '../api/auth.api';

export interface messageType {
  message: string;
  level: Level;
}

enum Level {
  OK,
  AVERTISSEMENT,
  DANGER,
}

export function Connexion() {
  const [email, setEmail] = useState<string>('');
  const [motDePasse, setMotDePasse] = useState<string>('');
  const [message, setMessage] = useState<messageType | undefined>();

  useEffect(() => {
    setMessage(undefined);
  }, []);

  async function essayeConnexion() {
    const res = await new AuthApi().connexion({ email, motDePasse });
    console.log(res);
    // const token = res.data.token;
    // await saveToken(token);
    // dispatch(connexion(token));
  }

  return (
    <View>
      <View>Connexion</View>
      {message && <View>{message.message}</View>}
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="matthieu.pierre@gmail.com"
        autoComplete="email"
      />
      <TextInput
        value={motDePasse}
        onChangeText={setMotDePasse}
        placeholder="motdePasse"
        autoComplete="current-password"
      />
      <Button title="Se connecter" onPress={essayeConnexion} />
    </View>
  );
}
