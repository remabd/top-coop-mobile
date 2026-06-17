import { Text, View, StyleSheet } from 'react-native';
import { ParticipationAvecCreneauEtCoParticipants } from '../../models/participation.type';
import { COLORS, FONT_SIZE, RADIUS, SPACING, TEXTE } from '../../STYLE_CONSTS';
import { SafeAreaView } from 'react-native-safe-area-context';

export function AnnuleParticipation(props: {
  participation: ParticipationAvecCreneauEtCoParticipants;
}) {
  const participation = props.participation;
  return (
    <View>
      <View style={styles.entete}>
        <Text style={TEXTE.titreModal}>Annulation</Text>
        <Text>Souhaitez-vous vraiment annuler ?</Text>
      </View>
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
  entete: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  creneau: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.vert_clair,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  creneauNom: TEXTE.corps,
  creneauDate: TEXTE.corps,
});
