import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { connexion as apiConnexion } from '../api/auth.api';
import {
  COLORS,
  FONTS_OUTFIT,
  FONT_SIZE,
  RADIUS,
  SPACING,
} from '../STYLE_CONSTS';
import { saveToken } from '../store/securetoken';
import { useDispatch } from 'react-redux';
import { connexion } from '../store/authSlice';

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
  const [motDePasseVisible, setMotDePasseVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<messageType | undefined>();
  const dispatch = useDispatch();

  useEffect(() => {
    setMessage(undefined);
  }, []);

  async function essayeConnexion() {
    const res = await apiConnexion({ email, motDePasse });

    if (res.ok) {
      setMessage({ message: 'Connecté', level: Level.OK });
      const token = res.data.access_token;
      await saveToken(token);
      dispatch(connexion(token));
      return;
    }

    switch (res.error.kind) {
      case 'http':
        setMessage({
          message: 'Email ou mot de passe incorrect',
          level: Level.DANGER,
        });
        break;
      case 'network':
        setMessage({ message: 'Serveur injoignable', level: Level.DANGER });
        break;
      default:
        setMessage({ message: 'Erreur inconnue', level: Level.DANGER });
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.titre}>Connexion</Text>

      {message?.level === Level.DANGER && (
        <Text style={styles.erreur}>{message.message}</Text>
      )}

      <View style={styles.champ}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email"
          placeholderTextColor={COLORS.placeholder}
          autoComplete="email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {email.length > 0 && (
          <Pressable onPress={() => setEmail('')} hitSlop={8}>
            <MaterialIcons name="close" size={22} color={COLORS.texte} />
          </Pressable>
        )}
      </View>

      <View style={styles.champ}>
        <TextInput
          style={styles.input}
          value={motDePasse}
          onChangeText={setMotDePasse}
          placeholder="mot de passe"
          placeholderTextColor={COLORS.placeholder}
          autoComplete="current-password"
          secureTextEntry={!motDePasseVisible}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable onPress={() => setMotDePasseVisible((v) => !v)} hitSlop={8}>
          <MaterialIcons
            name={motDePasseVisible ? 'visibility-off' : 'visibility'}
            size={22}
            color={COLORS.texte}
          />
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [styles.bouton, pressed && styles.boutonPresse]}
        onPress={essayeConnexion}
      >
        <Text style={styles.boutonTexte}>Se connecter</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.vert_clair,
    paddingHorizontal: 24,
    paddingTop: 70,
  },
  titre: {
    fontFamily: FONTS_OUTFIT.bold,
    fontSize: FONT_SIZE.titreXl,
    color: COLORS.orange,
    textAlign: 'center',
    marginBottom: 130,
  },
  erreur: {
    fontFamily: FONTS_OUTFIT.semibold,
    fontSize: FONT_SIZE.md,
    color: COLORS.erreur,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  champ: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.blanc,
    borderRadius: RADIUS.md,
    height: 54,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xxl,
    // ombre douce
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    flex: 1,
    fontFamily: FONTS_OUTFIT.regular,
    fontSize: FONT_SIZE.lg,
    color: COLORS.texte,
  },
  bouton: {
    backgroundColor: COLORS.orange,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignSelf: 'center',
    alignItems: 'center',
    minWidth: 190,
    marginTop: SPACING.xl,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  boutonPresse: {
    opacity: 0.85,
  },
  boutonTexte: {
    fontFamily: FONTS_OUTFIT.bold,
    fontSize: FONT_SIZE.xl,
    color: COLORS.blanc,
  },
});
