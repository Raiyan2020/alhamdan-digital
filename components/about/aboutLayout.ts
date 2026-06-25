export const ABOUT_DESKTOP_LAYOUT = {
  canvasWidth: 1440,
  heroTop: 274,
  heroHeight: 338,
  productsAnchorTop: 612,
  productStartTop: 663,
  productSectionHeight: 820,
  canvasPaddingBottom: 128,
  contentWidth: 628,
  image: {
    width: 520,
    height: 640,
    left: 80,
    right: 760,
    topLeft: 93,
    topRight: 88,
  },
  contentTop: 79,
  contentLeft: 80,
  contentRight: 732,
} as const;

export function getAboutProductTop(index: number) {
  return ABOUT_DESKTOP_LAYOUT.productStartTop + index * ABOUT_DESKTOP_LAYOUT.productSectionHeight;
}

export function getAboutProductContentLeft(imageOnLeft: boolean) {
  const { contentWidth, image, canvasWidth } = ABOUT_DESKTOP_LAYOUT;
  const canvasPadding = image.left;

  if (imageOnLeft) {
    const zoneStart = image.left + image.width;
    const zoneEnd = canvasWidth - canvasPadding;
    return zoneStart + (zoneEnd - zoneStart - contentWidth) / 2;
  }

  const zoneStart = canvasPadding;
  const zoneEnd = image.right;
  return zoneStart + (zoneEnd - zoneStart - contentWidth) / 2;
}

export function getAboutCanvasMinHeight(productCount: number) {
  if (productCount === 0) {
    return ABOUT_DESKTOP_LAYOUT.heroTop + ABOUT_DESKTOP_LAYOUT.heroHeight + ABOUT_DESKTOP_LAYOUT.canvasPaddingBottom;
  }

  return (
    getAboutProductTop(productCount - 1) +
    ABOUT_DESKTOP_LAYOUT.productSectionHeight +
    ABOUT_DESKTOP_LAYOUT.canvasPaddingBottom
  );
}
