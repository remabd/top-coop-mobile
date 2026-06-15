import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACING, TEXTE } from '../STYLE_CONSTS';

export default function Camera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [code, setCode] = useState<string | null>(null);

  if (!permission) {
    // Permissions en cours de chargement.
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
    if (code) return; // déjà scanné : on ignore les déclenchements suivants
    setCode(resultat.data);
    // TODO: utiliser resultat.data (EAN13/EAN8), ex. recherche produit / retour navigation
  }

  function valideScan() {
    if (!code) return;
    setCode(null);
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        // En mettant la callback à undefined une fois un code trouvé, on met
        // le scan en pause (onBarcodeScanned se déclenche en continu sinon).
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
          <Text style={styles.consigne}>
            Visez un code-barres EAN-13 ou EAN-8
          </Text>
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
