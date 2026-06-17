import {
  FlatList,
  Modal,
  Pressable,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { BlurView } from 'expo-blur';
import { ParticipationAvecCreneauEtCoParticipants } from '../../models/participation.type';
import { COLORS, RADIUS, SPACING, TEXTE } from '../../STYLE_CONSTS';
import { TROIS_JOURS_EN_MS } from '../../CONSTS';
import { demandeAnnulationParticipation } from '../../api/utilisateur.api';
import { AppDispatch } from '../../store/store';
import { afficheToast } from '../../store/toastSlice';
import { ParticipationDetails } from '../profil/ParticipationDetails';
import { AnnuleParticipation } from '../profil/AnnuleParticipation';
import { modal } from '../../styles/modal.style';

export function ListeParticipation(props: {
  participations: ParticipationAvecCreneauEtCoParticipants[];
  apercu?: number;
  scrollable?: boolean;
  onAnnulee?: (participation: ParticipationAvecCreneauEtCoParticipants) => void;
}) {
  const { participations, apercu, scrollable, onAnnulee } = props;
  const dispatch = useDispatch<AppDispatch>();
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

  async function confirmeAnnulation() {
    setConfirme(false);
    if (!choisie) return;
    const response = await demandeAnnulationParticipation(choisie);
    if (!response.ok) {
      dispatch(
        afficheToast({ message: "Échec de l'annulation", niveau: 'alerte' })
      );
      return;
    }
    dispatch(afficheToast({ message: 'Participation annulée', niveau: 'ok' }));
    onAnnulee?.(choisie);
  }

  function afficheAnnulation(item: ParticipationAvecCreneauEtCoParticipants) {
    choisir(item);
    setConfirme(true);
  }

  function afficheDetails(item: ParticipationAvecCreneauEtCoParticipants) {
    choisir(item);
    setVisible(true);
  }

  const donnees =
    apercu && !tous ? participations.slice(0, apercu) : participations;

  return (
    <>
      <FlatList
        data={donnees}
        scrollEnabled={scrollable ?? false}
        style={scrollable && styles.listeScrollable}
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
                onPress={() => afficheAnnulation(item)}
                disabled={desactive}
                hitSlop={8}
              >
                <Text style={[styles.annuler, desactive && styles.annulerOff]}>
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

      {apercu !== undefined && participations.length > apercu && (
        <Pressable
          style={styles.voirPlus}
          onPress={() => setTous((t) => !t)}
          hitSlop={8}
        >
          <Text style={styles.voirPlusTexte}>{tous ? 'Moins' : 'Plus'}</Text>
        </Pressable>
      )}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <BlurView
          intensity={4}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          style={modal.overlay}
        >
          <Pressable
            style={modal.overlayPressable}
            onPress={() => setVisible(false)}
          >
            <Pressable style={modal.carte} onPress={() => {}}>
              {choisie && <ParticipationDetails participation={choisie} />}
              <Pressable style={modal.btn} onPress={() => setVisible(false)}>
                <Text style={modal.btnText}>Fermer</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </BlurView>
      </Modal>

      <Modal
        visible={confirme}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirme(false)}
      >
        <BlurView
          intensity={4}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          style={modal.overlay}
        >
          <Pressable
            style={modal.overlayPressable}
            onPress={() => setConfirme(false)}
          >
            <Pressable style={modal.carte} onPress={() => {}}>
              {confirme && choisie && (
                <AnnuleParticipation participation={choisie} />
              )}
              <View style={modal.boiteBoutons}>
                <Pressable
                  style={[modal.btn, modal.btnFlex]}
                  onPress={() => setConfirme(false)}
                >
                  <Text style={[modal.btnText]}>Non</Text>
                </Pressable>
                <Pressable
                  style={[modal.btn, modal.btnFlex, modal.btnOrange]}
                  onPress={confirmeAnnulation}
                >
                  <Text style={modal.btnText}>Oui</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </BlurView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.vert_clair,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  listeScrollable: {
    maxHeight: 280,
  },
  separateur: {
    height: SPACING.sm,
  },
  nom: {
    ...TEXTE.corps,
    flex: 1,
  },
  date: {
    ...TEXTE.discret,
    marginHorizontal: 10,
  },
  annuler: {
    ...TEXTE.corpsFort,
    color: COLORS.orange,
    textDecorationLine: 'underline',
  },
  annulerOff: {
    color: COLORS.placeholder,
    textDecorationLine: 'none',
  },
  vide: TEXTE.discret,
  voirPlus: {
    alignSelf: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  voirPlusTexte: {
    ...TEXTE.titreSection,
    color: COLORS.vert_fonce,
  },
});
