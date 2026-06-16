import { useState } from 'react';
import {
  LayoutAnimation,
  Pressable,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, TEXTE } from '../STYLE_CONSTS';

export function Accordeon(props: {
  title: string;
  body: React.ReactNode;
  ouvert?: boolean;
}) {
  const [visible, setVisible] = useState<boolean>(props.ouvert ?? false);

  return (
    <View style={styles.conteneur}>
      <Pressable
        style={styles.entete}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setVisible((v) => !v);
        }}
      >
        <View style={styles.rond}>
          <MaterialIcons
            name={visible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={18}
            color={COLORS.texte}
          />
        </View>
        <Text style={styles.titre}>{props.title}</Text>
      </Pressable>
      {visible && <View style={styles.corps}>{props.body}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    marginBottom: 16,
  },
  entete: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rond: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.texte,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  titre: TEXTE.titreSection,
  corps: {
    gap: SPACING.sm,
  },
});
