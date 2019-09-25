const alignmentStyling = (className, options) => {
  const scrollbarWidth = options.scrollbarWidth || '0px';
  const gutter = options.gutter || '0px';
  const sizer = options.sizer || 0;
  const { maxWidth, contentWidth } = options;

  const css = {
    [className]: {
      'margin-left': `calc(50% - 50vw + (${scrollbarWidth} / 2) + ${gutter})`,
      'margin-right': `calc(50% - 50vw + (${scrollbarWidth} / 2) + ${gutter})`,
      'width': '100vw',
      'max-width': `calc(100vw - ${scrollbarWidth} - (${gutter} * 2))`,
    },
  };

  // touch devices do not have a scrollbar so remove it from the calculation
  if (scrollbarWidth !== '0px') {
    css['@media (pointer: coarse)'] = {
      [className]: {
        'margin-left': `calc(50% - 50vw + ${gutter})`,
        'margin-right': `calc(50% - 50vw + ${gutter})`,
        'max-width': `calc(100vw - ${gutter} * 2)`,
      },
    };
  }

  if (sizer && contentWidth) {
    // Use specific value rather than 100% to work when nested.
    const sideWidth = `(100vw - ${contentWidth})`;
    // calc() in media query isnt well supported, especially in safari.
    // `@media (min-width: calc(${contentWidth} + (${gutter} * 2)))`
    // for now we assume the units match.
    const unit = contentWidth.replace(/[0-9]+/, '');

    css[`@media (min-width: ${parseInt(contentWidth) + parseInt(gutter) * 2}${unit})`] = {
      [className]: {
        'margin-left': `calc(50% - (50vw - (${sideWidth} / 2) * ${sizer - 1}) + ${gutter})`,
        'margin-right': `calc(50% - (50vw - (${sideWidth} / 2) * ${sizer - 1}) + ${gutter})`,
        'max-width': `calc(100vw - (${sideWidth} * ${sizer - 1}) - (${gutter} * 2))`,
      },
    }
  }

  if (maxWidth) {
    // calc() in media query isnt well supported, especially in safari.
    // `@media (min-width: calc(${maxWidth} * ${sizer || 1} + ${gutter}))`
    // for now we assume the units match.
    const unit = maxWidth.replace(/[0-9]+/, '');

    css[`@media (min-width: ${parseInt(maxWidth) * (sizer || 1) + parseInt(gutter)}${unit})`] = {
      [className]: {
        'margin-left': `calc((100% - ${maxWidth}) / 2)`,
        'margin-right': `calc((100% - ${maxWidth}) / 2)`,
        'max-width': maxWidth,
      }
    };
  }

  return css;
};

module.exports = ({ addComponents, theme }) => {
  const { alignwide, alignfull, alignleftright, ...defaults } = theme('gutenberg.alignments', {});
  const backgroundGutter = defaults.backgroundGutter || '30px';

  if (alignwide) {
    addComponents(alignmentStyling('.alignwide', {...defaults, ...alignwide}));
  }
  if (alignfull) {
    addComponents(alignmentStyling('.alignfull', {...defaults, ...alignfull}));
  }

  // @see https://github.com/WordPress/gutenberg/pull/13964#issuecomment-472562800
  addComponents({
    // non-aligned content within alignwide and alignfull should have contentWidth.
    '.wp-block-group': {
      '&.alignwide, &.alignfull': {
        '& wp-block-group__inner-container > :not(.alignwide):not(.alignfull):not(.alignleft):not(.alignright)': {
          'max-width': defaults.contentWidth || '100%',
          'margin-left': 'auto',
          'margin-right': 'auto',
        }
      },
    },
    // nested blocks should be contained within parent, with core only blocks
    '.alignwide .alignwide, .alignwide .alignfull, .alignfull .alignfull': {
      'max-width': '100%',
      'margin-left': 0,
      'margin-right': 0,
    },
    // group and column blocks can contain other aligned blocks.
    '.wp-block-group:not(.alignwide):not(.alignfull), .wp-block-column': {
      '& .alignwide, & .alignfull': {
        'max-width': '100%',
        'margin-left': 0,
        'margin-right': 0,
      },
    },
  });

  if (backgroundGutter !== '0px') {
    addComponents({
      // Blocks with backgrounds have a padding.
      '.wp-block-group.has-background': {
        'padding-left': backgroundGutter,
        'padding-right': backgroundGutter,
      },
      '.wp-block-group.has-background .alignfull': {
        'margin-left': `-${backgroundGutter}`,
        'margin-right': `-${backgroundGutter}`,
        'max-width': `calc(100% + (${backgroundGutter} * 2))`,
      }
    });
  }

  if (alignleftright) {
    const { margin, minWidth } = alignleftright;
    addComponents({
      '.alignleft, .wp-block-image .alignleft, .alignright, .wp-block-image .alignright': {
        'float': 'none',
        'margin-left': 'auto',
        'margin-right': 'auto',
      },
      [`@media (min-width: ${minWidth || '640px'})`]: {
        '.alignleft, .wp-block-image .alignleft': {
          'margin-right': margin || '1em',
          'float': 'left',
        },
        '.alignright, .wp-block-image .alignright': {
          'margin-left': margin || '1em',
          'float': 'right',
        },
      },
    });
  }
};
