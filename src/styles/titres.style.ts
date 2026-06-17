import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, FONTS_OUTFIT, SPACING } from '../STYLE_CONSTS';

export const titres = StyleSheet.create({
  titre: {
    fontFamily: FONTS_OUTFIT.bold,
    fontSize: FONT_SIZE.titre,
    color: COLORS.orange,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  entete: {
    padding: SPACING.xl,
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: SPACING.xxl,
  },
});
