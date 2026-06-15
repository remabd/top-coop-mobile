import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ParticipationAvecCreneauEtCoParticipants } from '../../models/participation.type';
import { Accordeon } from '../Accordeon';
import { useState } from 'react';
import { ParticipationDetails } from './ParticipationDetails';
import { COLORS, TROIS_JOURS_EN_MS } from '../../CONST';
import { AnnuleParticipation } from './AnnuleParticipation';

export function Participations(props: {
  participations: ParticipationAvecCreneauEtCoParticipants[];
}) {
  const participations = props.participations;
  const [visible, setVisible] = useState<boolean>(false);
  const [confirme, setConfirme] = useState<boolean>(false);
  const [choisie, choisir] =
    useState<ParticipationAvecCreneauEtCoParticipants>();
  const [tous, setTous] = useState<boolean>(false);

  function peutannuler(
    item: ParticipationAvecCreneauEtCoParticipants
  ): boolean {
    return (
      new Date().getTime() + TROIS_JOURS_EN_MS >
      new Date(item.creneau.dateDebut).getTime()
    );
  }

  function confirmeAnnulation() {
    setConfirme(false);
  }

  function annule(item: ParticipationAvecCreneauEtCoParticipants) {
    choisir(item);
    setConfirme(true);
  }

  function afficheDetails(item: ParticipationAvecCreneauEtCoParticipants) {
    choisir(item);
    setVisible(true);
  }

  return (
    <>
      <Accordeon
        title="Mes participations"
        body={
          <>
            <FlatList
              data={tous ? participations : participations.slice(0, 6)}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const desactive = peutannuler(item);
                return (
                  <Pressable
                    style={styles.ligne}
                    onPress={() => afficheDetails(item)}
                  >
                    <Text style={styles.nom}>{item.creneau.nom}</Text>
                    <Text style={styles.date}>
                      {new Date(item.creneau.dateDebut).toLocaleDateString()}
                    </Text>
                    <Pressable
                      onPress={() => annule(item)}
                      disabled={desactive}
                      hitSlop={8}
                    >
                      <Text
                        style={[styles.annuler, desactive && styles.annulerOff]}
                      >
                        Annuler
                      </Text>
                    </Pressable>
                  </Pressable>
                );
              }}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <View style={styles.separateur} />}
              ListEmptyComponent={
                <Text style={styles.vide}>Aucunes participations</Text>
              }
            />
            <Pressable onPress={() => setTous((t) => !t)}>
              <Text>{tous ? 'Voir moins' : 'Voir plus'}</Text>
            </Pressable>{' '}
          </>
        }
      />
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.carte} onPress={() => {}}>
            {choisie && <ParticipationDetails participation={choisie} />}
            <Pressable
              style={styles.boutonFermer}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.boutonFermerTexte}>Fermer</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
      <Modal
        visible={confirme}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirme(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setConfirme(false)}>
          <Pressable style={styles.carte} onPress={() => {}}>
            {confirme && choisie && (
              <AnnuleParticipation participation={choisie} />
            )}
            <Pressable
              style={styles.boutonFermer}
              onPress={() => setConfirme(false)}
            >
              <Text style={styles.boutonFermerTexte}>Non</Text>
            </Pressable>{' '}
            <Pressable style={styles.boutonFermer} onPress={confirmeAnnulation}>
              <Text style={styles.boutonFermerTexte}>Oui</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>{' '}
    </>
  );
}

const styles = StyleSheet.create({
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.vert_clair,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  separateur: {
    height: 8,
  },
  nom: {
    flex: 1,
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
    color: COLORS.texte,
  },
  date: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: COLORS.texte,
    marginHorizontal: 10,
  },
  annuler: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
    color: COLORS.orange,
    textDecorationLine: 'underline',
  },
  annulerOff: {
    color: COLORS.placeholder,
    textDecorationLine: 'none',
  },
  vide: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: COLORS.placeholder,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carte: {
    width: '85%',
    backgroundColor: COLORS.blanc,
    borderRadius: 14,
    padding: 18,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  boutonFermer: {
    backgroundColor: COLORS.vert_fonce,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  boutonFermerTexte: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 15,
    color: COLORS.blanc,
  },
});
