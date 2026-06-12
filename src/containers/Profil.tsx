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
import { COLORS } from '../CONST';
import { UtilisateurCard } from '../components/profil/UtilisateurCard';
import { Paniers } from '../components/profil/Paniers';
import { Participations } from '../components/profil/Participations';
import { Accordeon } from '../components/Accordeon';

const PREFERENCES = [
  'Mes informations',
  'Langues',
  'Notifications',
  'Thème',
  'Signaler un problème',
  'À propos',
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
                  <Pressable key={p} style={styles.preference}>
                    <Text style={styles.preferenceTexte}>{p}</Text>
                  </Pressable>
                ))}
                <Pressable style={styles.preference} onPress={deconnecte}>
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
    padding: 16,
    paddingTop: 30,
    paddingBottom: 32,
  },
  entete: {
    backgroundColor: COLORS.blanc,
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
  },
  titre: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 22,
    color: COLORS.orange,
    textAlign: 'center',
    marginBottom: 14,
  },
  erreur: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
    color: COLORS.erreur,
    textAlign: 'center',
    marginBottom: 14,
  },
  preference: {
    paddingVertical: 7,
  },
  preferenceTexte: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: COLORS.texte,
  },
  deconnexion: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
    color: COLORS.orange,
  },
});
