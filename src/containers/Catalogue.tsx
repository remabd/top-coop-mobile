import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { loadToken } from '../store/securetoken';
import {
  COLORS,
  FONTS_OUTFIT,
  FONT_SIZE,
  RADIUS,
  SPACING,
  TEXTE,
} from '../STYLE_CONSTS';

enum Unite {
  VRAC = 'VRAC',
  UNITE = 'UNITE',
}

interface TypeProduit {
  id: string;
  nom: string;
  prix: number;
  unite: Unite;
  ean?: string;
}

interface ProduitLotAPI {
  id: string;
  typeProduitId: string;
  quantite: number;
  dateArrive: string;
  dateSortie?: string | null;
  typeProduit?: TypeProduit;
}

interface ProduitGroupé {
  typeProduitId: string;
  quantiteGlobale: number;
  typeProduit: TypeProduit;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

export function Catalogue() {
  const navigation = useNavigation();
  const [produits, setProduits] = useState<ProduitGroupé[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function fetchCatalogue() {
      try {
        const token = await loadToken();

        const response = await fetch(`${API_BASE_URL}/produit/avecType`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Impossible de charger le catalogue.');
        }

        const data = await response.json();
        const listeBrute: ProduitLotAPI[] = Array.isArray(data) ? data : [];

        const groups: Record<string, ProduitGroupé> = {};

        listeBrute.forEach((p) => {
          if (!p || !p.typeProduitId || !p.typeProduit) return;

          if (!groups[p.typeProduitId]) {
            groups[p.typeProduitId] = {
              typeProduitId: p.typeProduitId,
              quantiteGlobale: 0,
              typeProduit: p.typeProduit,
            };
          }
          groups[p.typeProduitId].quantiteGlobale += p.quantite || 0;
        });

        const listeFusionnee = Object.values(groups);

        const listeTriee = listeFusionnee.sort((a, b) =>
          (a.typeProduit?.nom || '').localeCompare(b.typeProduit?.nom || '')
        );

        setProduits(listeTriee);
      } catch (err: any) {
        console.error('Erreur catalogue:', err);
        setErreur(err.message || 'Une erreur est survenue.');
      } finally {
        setLoading(false);
      }
    }

    fetchCatalogue();
  }, []);

  const produitsFiltrés = useMemo(() => {
    if (!searchQuery.trim()) return produits;
    const query = searchQuery.toLowerCase().trim();
    return produits.filter((p) =>
      p.typeProduit?.nom?.toLowerCase().includes(query)
    );
  }, [searchQuery, produits]);

  const renderProduitItem = ({
    item,
    index,
  }: {
    item: ProduitGroupé;
    index: number;
  }) => {
    const type = item.typeProduit;
    if (!type) return null;

    const estEnStock = item.quantiteGlobale > 0;
    const suffixeUnite = type.unite === Unite.VRAC ? '€/kg' : '€';

    const prixAffiche =
      typeof type.prix === 'number' ? type.prix.toFixed(2) : '0.00';

    // Alternance des couleurs de fond des cartes (index pair vs index impair)
    const fondCarte = index % 2 === 0 ? styles.carteClaire : styles.carteGrisee;

    return (
      <View style={[styles.carteProduit, fondCarte]}>
        <View style={styles.zoneInfos}>
          <Text style={styles.nomProduit}>{type.nom}</Text>
          <Text style={styles.prixProduit}>
            {prixAffiche} {suffixeUnite}
          </Text>
        </View>

        <View
          style={[
            styles.badgeStatut,
            estEnStock ? styles.badgeEnStock : styles.badgeRupture,
          ]}
        >
          <Text
            style={[
              styles.texteBadge,
              estEnStock ? styles.texteEnStock : styles.texteRupture,
            ]}
          >
            {estEnStock ? 'En stock' : 'Rupture'}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centre]}>
        <ActivityIndicator size="large" color={COLORS.orange} />
      </View>
    );
  }

  if (erreur) {
    return (
      <View style={[styles.container, styles.centre]}>
        <Text style={styles.texteErreur}>{erreur}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Barre supérieure */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.boutonRetour}
          onPress={() => navigation.goBack()}
          hitSlop={15}
        >
          <MaterialIcons name="arrow-back" size={26} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.titrePage}>Catalogue</Text>
        <View style={styles.headerEspace} />
      </View>

      {/* Barre de recherche verte et élargie */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={22} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un produit..."
          placeholderTextColor="#445D44"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={produitsFiltrés}
        keyExtractor={(item) => item.typeProduitId}
        renderItem={renderProduitItem}
        contentContainerStyle={styles.listeContenu}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centreVide}>
            <Text style={styles.texteVide}>
              Aucun produit ne correspond à votre recherche.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blanc,
  },
  centre: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  boutonRetour: {
    paddingVertical: SPACING.xs,
    paddingRight: SPACING.md,
  },
  titrePage: {
    fontFamily: FONTS_OUTFIT.bold,
    fontSize: FONT_SIZE.titre,
    color: COLORS.orange,
    textAlign: 'center',
    flex: 1,
  },
  headerEspace: {
    width: 35,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    height: 50,
    borderWidth: 1,
    borderColor: '#445D44',
  },
  searchIcon: {
    marginRight: SPACING.sm,
    color: '#445D44',
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS_OUTFIT.regular,
    fontSize: 16,
    color: '#2C2C2C',
  },
  listeContenu: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  carteProduit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.bordure,
  },
  carteClaire: {
    backgroundColor: '#CCE6BB',
  },
  carteGrisee: {
    backgroundColor: 'rgb(204, 230, 187, 0.6)',
  },
  zoneInfos: {
    flex: 1,
    gap: SPACING.xs,
  },
  nomProduit: {
    ...TEXTE.corpsFort,
    color: '#2C2C2C',
  },
  prixProduit: {
    ...TEXTE.corps,
    color: COLORS.orange,
    fontWeight: 'bold',
  },
  badgeStatut: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    minWidth: 85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEnStock: {
    backgroundColor: '#eaffe4',
  },
  badgeRupture: {
    backgroundColor: '#FCE8E6',
  },
  texteBadge: {
    fontFamily: FONTS_OUTFIT.bold,
    fontSize: FONT_SIZE.sm || 13,
  },
  texteEnStock: {
    color: COLORS.vert_fonce || '#3E5C45',
  },
  texteRupture: {
    color: COLORS.erreur || '#C53030',
  },
  centreVide: {
    marginTop: 40,
    alignItems: 'center',
  },
  texteVide: {
    ...TEXTE.corps,
    color: COLORS.placeholder,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  texteErreur: {
    fontFamily: FONTS_OUTFIT.semibold,
    color: COLORS.erreur,
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
  },
});
