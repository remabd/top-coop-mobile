import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONT_SIZE,
  FONTS_OUTFIT,
  RADIUS,
  SPACING,
} from '../STYLE_CONSTS';

export const modal = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  overlayPressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  carte: {
    width: '85%',
    backgroundColor: COLORS.blanc,
    borderRadius: RADIUS.lg,
    padding: SPACING.xxl,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  boiteBoutons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  btnFlex: {
    flex: 1,
  },
  btn: {
    backgroundColor: COLORS.vert_fonce,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  btnText: {
    fontFamily: FONTS_OUTFIT.semibold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.blanc,
  },
  btnOrange: {
    backgroundColor: COLORS.orange,
  },
});
