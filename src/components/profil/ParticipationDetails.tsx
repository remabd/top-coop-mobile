import { StyleSheet, Text, View } from 'react-native';
import { ParticipationAvecCreneauEtCoParticipants } from '../../models/participation.type';
import { COLORS } from '../../CONST';

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
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: COLORS.texte,
    textAlign: 'center',
    marginBottom: 14,
  },
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
  label: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
    color: COLORS.texte,
    marginBottom: 8,
  },
  participant: {
    backgroundColor: COLORS.vert_clair,
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  participantTexte: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: COLORS.texte,
  },
});
