import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACING, TEXTE } from '../STYLE_CONSTS';
import { demandeTypeProduitAvecEan } from '../api/panier.api';
import { useDispatch, useSelector } from 'react-redux';
import { modifiePanier, panierSelector } from '../store/panierSlice';

export default function Camera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [code, setCode] = useState<string | null>(null);
  const panier = useSelector(panierSelector);
  const dispatch = useDispatch();

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
      return;
    }
    dispatch(
      modifiePanier({
        prix: panier.prix + response.data.prix,
        produits: [...panier.produits, response.data],
      })
    );
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

      {/* Cadre de visée */}
      <View style={styles.calque} pointerEvents="box-none">
        <View style={styles.cadre} />

        {code ? (
          <View style={styles.resultat}>
            <Text style={styles.resultatLabel}>Code scanné</Text>
            <Text style={styles.resultatCode}>{code}</Text>
            <Pressable style={styles.bouton} onPress={() => setCode(null)}>
              <Text style={styles.boutonTexte}>Scanner à nouveau</Text>
            </Pressable>
            <Pressable style={styles.bouton} onPress={() => valideScan()}>
              <Text style={styles.boutonTexte}>Scanner un nouveau</Text>
            </Pressable>
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
  bouton: {
    backgroundColor: COLORS.vert_fonce,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
  },
  boutonTexte: {
    fontFamily: TEXTE.corpsFort.fontFamily,
    fontSize: TEXTE.titreModal.fontSize,
    color: COLORS.blanc,
  },
});
