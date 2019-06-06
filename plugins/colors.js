module.exports = ({ addUtilities, theme, e }) => {
  const colors = theme('gutenberg.colors');
  const utilities = {};

  for (let [slug, color] of Object.entries(colors)) {
    utilities[`.${e(`has-${slug}-background-color`)}`] = { 'background-color': color };
    utilities[`.${e(`has-${slug}-color`)}`] = { color: color };
  }

  addUtilities(utilities, {
    respectPrefix: false,
    respectImportant: true,
  });
};
