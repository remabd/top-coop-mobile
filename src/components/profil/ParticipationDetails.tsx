import { StyleSheet, Text, View } from 'react-native';
import { ParticipationAvecCreneauEtCoParticipants } from '../../models/participation.type';
import { COLORS, RADIUS, SPACING, TEXTE } from '../../STYLE_CONSTS';

export function ParticipationDetails(props: {
  participation: ParticipationAvecCreneauEtCoParticipants;
}) {
  const participation = props.participation;
  return (
    <View>
      <Text style={styles.titre}>Détail (participation)</Text>

      <View style={styles.creneau}>
        <Text style={styles.creneauNom}>{participation.creneau.nom}</Text>
        <Text style={styles.creneauDate}>
          {new Date(participation.creneau.dateDebut).toLocaleDateString()}
        </Text>
      </View>

      <Text style={styles.label}>Liste des participants</Text>
      {participation.creneau.participations.map((p) => (
        <View key={p.id} style={styles.participant}>
          <Text style={styles.participantTexte}>
            {p.utilisateur.prenom} {p.utilisateur.nom}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  titre: {
    ...TEXTE.titreModal,
    textAlign: 'center',
    marginBottom: SPACING.lg,
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
  creneauNom: TEXTE.corpsFort,
  creneauDate: TEXTE.discret,
  label: {
    ...TEXTE.corps,
    marginBottom: SPACING.sm,
  },
  participant: {
    backgroundColor: COLORS.vert_clair,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  participantTexte: TEXTE.corps,
});
