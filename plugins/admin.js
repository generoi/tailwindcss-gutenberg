module.exports = ({ addComponents, theme }) => {
  const contentWidth = theme('gutenberg.alignments.contentWidth');
  const components = {
    // block editor sets the width on a wrapper so unset our own values.
    '[data-align="wide"] .alignwide, [data-align="full"] .alignfull': {
      'margin-left': '0 !important',
      'margin-right': '0 !important',
      'width': 'auto'
    },

    // This is added on front-end but for some reason not back-end.
    '[data-align="left"] .wp-block-pullquote, [data-align="right"] .wp-block-pullquote': {
      'max-width': '305px',
    },

    // For some reason core hardcodes this in the editor breaking the cascade
    // that otherwise happens on the front-end.
    '.wp-block-cover .block-editor-block-list__block': {
      color: 'inherit',
    },
  };

  // use the same width as the page does so that floated blocks appear the same
  if (contentWidth) {
    components['wp-block:not([data-align="full"]):not([data-align="wide"])'] = {
      'max-width': `calc(${contentWidth} + 30px)`,
    };
  }

  addComponents(components);
};
