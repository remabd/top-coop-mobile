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
import { COLORS, FONTS_OUTFIT, FONTS_FIGTREE, FONT_SIZE, RADIUS, SPACING } from '../STYLE_CONSTS';
import { UtilisateurCard } from '../components/profil/UtilisateurCard';
import { Paniers } from '../components/profil/Paniers';
import { Participations } from '../components/profil/Participations';
import { Accordeon } from '../components/Accordeon';
import type { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PREFERENCES: {label: string; icone: ComponentProps<typeof MaterialCommunityIcons>["name"];}[] = [
  { label: 'Mes informations', icone: "account-outline" },
  { label: 'Langues', icone: "translate" },
  { label: 'Notifications', icone: "bell-outline" },
  { label: 'Thème', icone: "palette-outline" },
  { label: 'Signaler un problème', icone: "alert-decagram-outline" },
  { label: 'À propos', icone: "information-outline" },
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
    <ScrollView style={styles.ecran} contentContainerStyle={styles.contenu}>
      {!utilisateur ? (
        <View>
          <ActivityIndicator size="large" color={COLORS.vert_fonce} />
          <Pressable style={styles.preference} onPress={deconnecte}>
            <Text style={styles.deconnexion}>Se déconnecter</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.entete}>
            <Text style={styles.titre}>Profil</Text>
            <UtilisateurCard utilisateur={utilisateur} />
          </View>

          {message.length > 0 && <Text style={styles.erreur}>{message}</Text>}

          <Paniers paniers={paniers} />
          <Participations participations={participations} />

          <Accordeon
            title="Préférences"
            body={
              <View>
                {PREFERENCES.map((p) => (
                  <Pressable key={p.label} style={styles.preference}>
                    <MaterialCommunityIcons name={p.icone} size={20} color={COLORS.vert_fonce} />
                    <Text style={styles.preferenceTexte}>{p.label}</Text>
                  </Pressable>
                ))}
                <Pressable style={styles.preference} onPress={deconnecte}>
                  <MaterialCommunityIcons name="logout" size={20} color={COLORS.orange} />
                  <Text style={styles.deconnexion}>Se déconnecter</Text>
                </Pressable>
              </View>
            }
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: COLORS.blanc,
  },
  contenu: {
    padding: SPACING.xl,
    paddingTop: 30,
    paddingBottom: 32,
  },
  entete: {
    backgroundColor: COLORS.blanc,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    paddingLeft: 0,
    marginBottom: SPACING.xxl,
  },
  titre: {
    fontFamily: FONTS_FIGTREE.bold,
    fontSize: FONT_SIZE.titre,
    color: COLORS.orange,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
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
