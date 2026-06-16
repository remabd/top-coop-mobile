import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, RADIUS, SPACING, TEXTE } from '../STYLE_CONSTS';
import { demandeTypeProduitAvecEan } from '../api/panier.api';
import { useDispatch, useSelector } from 'react-redux';
import { modifiePanier, panierSelector } from '../store/panierSlice';

export default function Camera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [code, setCode] = useState<string | null>(null);
  const panier = useSelector(panierSelector);
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centre]}>
        <Text style={styles.message}>
          Nous avons besoin de la caméra pour scanner les codes-barres.
        </Text>
        <Pressable style={styles.bouton} onPress={requestPermission}>
          <Text style={styles.boutonTexte}>Autoriser la caméra</Text>
        </Pressable>
      </View>
    );
  }

  function onCodeScanne(resultat: BarcodeScanningResult) {
    if (code) return;
    setCode(resultat.data);
  }

  async function valideScan() {
    if (!code) return;

    const response = await demandeTypeProduitAvecEan(code);
    if (!response.ok) {
      //TOAST
      return;
    }
    const indexExistant = panier.produits.findIndex(
      (p) => p.typeProduit.id === response.data.typeProduit.id
    );

    const nouveauxProduits =
      indexExistant === -1
        ? [...panier.produits, response.data]
        : panier.produits.map((p, i) =>
            i === indexExistant
              ? { ...p, quantite: p.quantite + response.data.quantite }
              : p
          );
    dispatch(
      modifiePanier({
        prix: panier.prix + response.data.prix,
        produits: nouveauxProduits,
      })
    );

    //TOAST
    setCode(null);
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={code ? undefined : onCodeScanne}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8'],
        }}
      />

      <Pressable
        style={styles.retour}
        onPress={() => navigation.goBack()}
        hitSlop={8}
      >
        <MaterialIcons name="arrow-back" size={26} color={COLORS.blanc} />
      </Pressable>

      {/* Cadre de visée */}
      <View style={styles.calque} pointerEvents="box-none">
        <View style={styles.cadre} />

        {code ? (
          <View style={styles.resultat}>
            <Text style={styles.resultatLabel}>Code scanné</Text>
            <Text style={styles.resultatCode}>{code}</Text>
            <View style={styles.boutons}>
              <Pressable
                style={[styles.bouton, styles.boutonRescan]}
                onPress={() => setCode(null)}
              >
                <MaterialIcons name="replay" size={22} color={COLORS.blanc} />
              </Pressable>
              <Pressable
                style={[styles.bouton, styles.boutonAjouter]}
                onPress={() => valideScan()}
              >
                <Text style={styles.boutonTexte}>Suivant</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Text style={styles.consigne}>Visez un code-barres</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centre: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  camera: {
    flex: 1,
  },
  retour: {
    position: 'absolute',
    top: 50,
    left: SPACING.xl,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calque: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cadre: {
    width: '80%',
    height: 160,
    borderWidth: 2,
    borderColor: COLORS.blanc,
    borderRadius: RADIUS.md,
    backgroundColor: 'transparent',
  },
  consigne: {
    ...TEXTE.corpsFort,
    color: COLORS.blanc,
    marginTop: SPACING.xl,
    textAlign: 'center',
  },
  message: {
    ...TEXTE.corps,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  resultat: {
    marginTop: SPACING.xl,
    alignItems: 'center',
    backgroundColor: COLORS.blanc,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
  },
  resultatLabel: TEXTE.discret,
  resultatCode: {
    ...TEXTE.titreModal,
    marginBottom: SPACING.md,
  },
  boutons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  bouton: {
    backgroundColor: COLORS.vert_fonce,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutonRescan: {
    paddingHorizontal: SPACING.md,
  },
  boutonAjouter: {
    backgroundColor: COLORS.orange,
  },
  boutonTexte: {
    fontFamily: TEXTE.corpsFort.fontFamily,
    fontSize: TEXTE.titreModal.fontSize,
    color: COLORS.blanc,
  },
});
