import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { deconnexion } from '../store/authSlice';
import { clear } from '../store/securetoken';
import { useEffect, useState } from 'react';
import { Panier } from '../models/panier.type';
import { ParticipationAvecCreneauEtCoParticipants } from '../models/participation.type';
import { UtilisateurInfos } from '../models/utilisateur.type';
import {
  chargeInformations,
  chargePaniers,
  chargeParticipations,
} from '../api/utilisateur.api';
import { COLORS, FONTS_FIGTREE, FONT_SIZE, SPACING } from '../STYLE_CONSTS';
import { UtilisateurCard } from '../components/profil/UtilisateurCard';
import { Paniers } from '../components/profil/Paniers';
import { Participations } from '../components/profil/Participations';
import { Accordeon } from '../components/Accordeon';
import type { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { titres } from '../styles/titres.style';

const PREFERENCES: {
  label: string;
  icone: ComponentProps<typeof MaterialCommunityIcons>['name'];
}[] = [
  { label: 'Mes informations', icone: 'account-outline' },
  { label: 'Langues', icone: 'translate' },
  { label: 'Notifications', icone: 'bell-outline' },
  { label: 'Thème', icone: 'palette-outline' },
  { label: 'Signaler un problème', icone: 'alert-decagram-outline' },
  { label: 'À propos', icone: 'information-outline' },
];

export function Profil(props: any) {
  const dispatch = useDispatch();
  const [paniers, setPaniers] = useState<Panier[]>([]);
  const [participations, setParticipations] = useState<
    ParticipationAvecCreneauEtCoParticipants[]
  >([]);
  const [utilisateur, setUtilisateur] = useState<UtilisateurInfos>();
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    let ures = await chargeInformations();
    if (ures.ok) {
      setUtilisateur(ures.data);
    }
    let pres = await chargePaniers();
    if (pres.ok) {
      pres.data.sort(
        (p1, p2) =>
          new Date(p2.dateCreation).getTime() -
          new Date(p1.dateCreation).getTime()
      );
      setPaniers(pres.data);
    }
    let ores = await chargeParticipations();
    if (ores.ok) {
      ores.data.sort(
        (p1, p2) =>
          new Date(p2.creneau.dateDebut).getTime() -
          new Date(p1.creneau.dateDebut).getTime()
      );
      setParticipations(ores.data);
    }
    if (!ores.ok || !ures.ok || !pres.ok) {
      setMessage('Erreur, serveur injoignable');
    }
  }

  async function deconnecte() {
    await clear();
    dispatch(deconnexion());
  }

  return (
    <View style={styles.ecran}>
      {!utilisateur ? (
        <View>
          <ActivityIndicator size="large" color={COLORS.vert_fonce} />
          <Pressable style={styles.preference} onPress={deconnecte}>
            <Text style={styles.deconnexion}>Se déconnecter</Text>
          </Pressable>
        </View>
      ) : (
        <View style={titres.entete}>
          <Text style={titres.titre}>Profil</Text>
          <UtilisateurCard utilisateur={utilisateur} />
        </View>
      )}
      <ScrollView
        contentContainerStyle={styles.contenu}
        showsVerticalScrollIndicator={false}
      >
        {!utilisateur ? (
          <View>
            <Text>
              Vous n`&apos`êtes pas connecté. Déconnectez-vous puis reconnecter.
            </Text>
          </View>
        ) : (
          <>
            {message.length > 0 && <Text style={styles.erreur}>{message}</Text>}
            <Paniers paniers={paniers} />
            <Participations
              participations={participations}
              onAnnulee={(annulee) =>
                setParticipations((prev) =>
                  prev.filter((p) => p.id !== annulee.id)
                )
              }
            />
            <Accordeon
              title="Préférences"
              ouvert
              body={
                <View>
                  {PREFERENCES.map((p) => (
                    <Pressable key={p.label} style={styles.preference}>
                      <MaterialCommunityIcons
                        name={p.icone}
                        size={20}
                        color={COLORS.vert_fonce}
                      />
                      <Text style={styles.preferenceTexte}>{p.label}</Text>
                    </Pressable>
                  ))}
                  <Pressable style={styles.preference} onPress={deconnecte}>
                    <MaterialCommunityIcons
                      name="logout"
                      size={20}
                      color={COLORS.orange}
                    />
                    <Text style={styles.deconnexion}>Se déconnecter</Text>
                  </Pressable>
                </View>
              }
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 30,
    paddingBottom: 0,
    padding: SPACING.xl,
  },
  contenu: {},
  erreur: {
    fontFamily: FONTS_FIGTREE.semibold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.erreur,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  preference: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: 7,
    height: 'auto',
  },
  preferenceTexte: {
    fontFamily: FONTS_FIGTREE.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.texte,
  },
  deconnexion: {
    fontFamily: FONTS_FIGTREE.semibold,
    fontSize: FONT_SIZE.md,
    color: COLORS.orange,
  },
});
