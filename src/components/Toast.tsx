import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TEXTE } from '../STYLE_CONSTS';

export type NiveauToast = 'ok' | 'avertissement' | 'alerte';

type NomIcone = keyof typeof MaterialIcons.glyphMap;

const NIVEAUX: Record<NiveauToast, { icone: NomIcone; couleur: string }> = {
  ok: { icone: 'check-circle', couleur: COLORS.vert_fonce },
  avertissement: { icone: 'warning', couleur: COLORS.orange },
  alerte: { icone: 'error', couleur: COLORS.erreur },
};

const DUREE_ANIMATION = 250;

export function Toast(props: {
  message: string;
  niveau?: NiveauToast;
  duree?: number;
  onHide: () => void;
}) {
  const niveau = NIVEAUX[props.niveau ?? 'ok'];
  const duree = props.duree ?? 2000;

  // 0 = caché (au-dessus de l'écran), 1 = affiché
  const apparition = useRef(new Animated.Value(0)).current;
  // 0 = barre pleine, 1 = barre vide
  const progression = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sequence = Animated.sequence([
      Animated.timing(apparition, {
        toValue: 1,
        duration: DUREE_ANIMATION,
        useNativeDriver: true,
      }),
      Animated.delay(duree),
      Animated.timing(apparition, {
        toValue: 0,
        duration: DUREE_ANIMATION,
        useNativeDriver: true,
      }),
    ]);

    const barre = Animated.sequence([
      Animated.delay(DUREE_ANIMATION),
      Animated.timing(progression, {
        toValue: 1,
        duration: duree,
        useNativeDriver: false,
      }),
    ]);

    sequence.start(({ finished }) => finished && props.onHide());
    barre.start();

    return () => {
      sequence.stop();
      barre.stop();
    };
  }, [props.message]);

  const translateY = apparition.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 0],
  });
  const largeurBarre = progression.interpolate({
    inputRange: [0, 1],
    outputRange: ['100%', '0%'],
  });

  return (
    <Animated.View
      style={[
        styles.ombre,
        { opacity: apparition, transform: [{ translateY }] },
      ]}
      pointerEvents="none"
    >
      <View style={styles.carte}>
        <View style={styles.pisteBarre}>
          <Animated.View
            style={[
              styles.barre,
              { width: largeurBarre, backgroundColor: niveau.couleur },
            ]}
          />
        </View>
        <View style={styles.contenu}>
          <MaterialIcons
            name={niveau.icone}
            size={22}
            color={niveau.couleur}
            style={styles.icone}
          />
          <Text style={styles.texte}>{props.message}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ombre: {
    position: 'absolute',
    top: 50,
    left: SPACING.xl,
    right: SPACING.xl,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  carte: {
    backgroundColor: COLORS.blanc,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  pisteBarre: {
    height: 4,
    backgroundColor: COLORS.bordure,
  },
  barre: {
    height: 4,
  },
  contenu: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  icone: {
    marginRight: SPACING.md,
  },
  texte: {
    ...TEXTE.corpsFort,
    flex: 1,
  },
});
