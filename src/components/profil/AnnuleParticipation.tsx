import { Text, View, StyleSheet } from 'react-native';
import { ParticipationAvecCreneauEtCoParticipants } from '../../models/participation.type';
import { COLORS } from '../../CONST';

export function AnnuleParticipation(props: {
  participation: ParticipationAvecCreneauEtCoParticipants;
}) {
  const participation = props.participation;
  return (
    <View>
      <Text>Annulation</Text>
      <Text>Voulez vous vraiment annuler ?</Text>
      <View style={styles.creneau}>
        <Text style={styles.creneauNom}>{participation.creneau.nom}</Text>
        <Text style={styles.creneauDate}>
          {new Date(participation.creneau.dateDebut).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  creneau: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.vert_clair,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  creneauNom: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
    color: COLORS.texte,
  },
  creneauDate: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: COLORS.texte,
  },
});
