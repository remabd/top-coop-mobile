import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { UtilisateurInfos } from '../../models/utilisateur.type';
import { COLORS } from '../../CONST';

export function UtilisateurCard(props: { utilisateur: UtilisateurInfos }) {
  const utilisateur = props.utilisateur;
  return (
    <View style={styles.ligne}>
      <View style={styles.avatar}>
        <MaterialIcons name="person" size={26} color={COLORS.placeholder} />
      </View>
      <View>
        <Text style={styles.nom}>
          {`${utilisateur.prenom} ${utilisateur.nom}`}
        </Text>
        <Text style={styles.role}>{utilisateur.role}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.avatar,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nom: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 15,
    color: COLORS.texte,
  },
  role: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: COLORS.placeholder,
  },
});
