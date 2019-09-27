module.exports = ({ addUtilities, theme, e }) => {
  const fontsizes = theme('gutenberg.fontSizes', {});
  const utilities = {};

  for (let [slug, fontSize] of Object.entries(fontsizes)) {
    slug = slug.replace(/([0-9])([a-z])/g, '$1-$2'); // wp dashes these.
    utilities[`.${e(`has-${slug}-font-size`)}`] = { 'font-size': fontSize };
  }

  addUtilities(utilities, {
    respectPrefix: false,
    respectImportant: true,
  });
};
