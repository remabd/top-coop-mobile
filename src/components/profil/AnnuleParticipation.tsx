import { Text, View, StyleSheet } from 'react-native';
import { ParticipationAvecCreneauEtCoParticipants } from '../../models/participation.type';
import { COLORS, RADIUS, SPACING, TEXTE } from '../../STYLE_CONSTS';

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
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  creneauNom: TEXTE.corpsFort,
  creneauDate: TEXTE.corps,
});
