import { StyleSheet } from 'react-native';

export const COLORS = {
  vert_clair: '#CCE6BB',
  vert_clair_60: '#ebf5e4',
  vert_fonce: '#445D44',
  orange: '#CE8536',
  erreur: '#C0392B',
  blanc: '#FFFFFF',
  texte: '#3C3C3C',
  placeholder: '#6B6B6B',
  avatar: '#D9D9D9',
  bordure: '#D7D7D7',
  noir: '#222222',
};

export const FONTS_OUTFIT = {
  regular: 'Outfit_400Regular',
  semibold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
} as const;

export const FONTS_FIGTREE = {
  regular: 'Figtree_400Regular',
  semibold: 'Figtree_600SemiBold',
  bold: 'Figtree_700Bold',
} as const;

export const FONT_SIZE = {
  sm: 13,
  md: 14,
  lg: 15,
  xl: 16,
  titre: 22,
  titreH2: 20,
  titreH3: 18,
  titreXl: 26,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  xxl: 18,
} as const;

export const RADIUS = {
  sm: 8,
  md: 10,
  lg: 14,
} as const;

export const TEXTE = StyleSheet.create({
  corps: {
    fontFamily: FONTS_FIGTREE.regular,
    fontSize: FONT_SIZE.xl,
    color: COLORS.texte,
  },
  corpsSmall: {
    fontFamily: FONTS_FIGTREE.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.texte,
  },
  corpsFort: {
    fontFamily: FONTS_FIGTREE.bold,
    fontSize: FONT_SIZE.xl,
    color: COLORS.texte,
  },
  discret: {
    fontFamily: FONTS_FIGTREE.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.placeholder,
  },
  titreSection: {
    fontFamily: FONTS_OUTFIT.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.texte,
  },
  titreModal: {
    fontFamily: FONTS_OUTFIT.bold,
    fontSize: FONT_SIZE.titreH3,
    color: COLORS.orange,
    textAlign: 'center',
  },
});
