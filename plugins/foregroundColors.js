const chroma = require('chroma-js');

const pickHighestContrastColor = (foregroundColors, background) => {
  return foregroundColors.reduce((color, currentColor) => {
    return chroma.contrast(background, color) > chroma.contrast(background, currentColor)
      ? color : currentColor;
  }, foregroundColors[0]);
};

module.exports = ({ addComponents, theme, e }) => {
  const components = {};
  const colors = theme('gutenberg.colors', {})
  const foregroundColors = theme('gutenberg.foregroundColors', ['#000000', '#ffffff']);

  for (let [slug, color] of Object.entries(colors)) {
    // pick a default text color with highest contrast.
    let textColor = chroma.valid(color) ? pickHighestContrastColor(foregroundColors, color) : foregroundColors[0];
    components[`.${e(`has-${slug}-background-color`)}`] = { 'color': textColor };
  }

  addComponents(components);
};
