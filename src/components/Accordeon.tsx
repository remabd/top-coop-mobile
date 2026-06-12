import { useState } from 'react';
import {
  LayoutAnimation,
  Pressable,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../CONST';

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
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: COLORS.texte,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  titre: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: COLORS.texte,
  },
  corps: {
    gap: 8,
  },
});
