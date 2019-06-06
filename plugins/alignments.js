const alignmentStyling = (className, options) => {
  const scrollbarWidth = options.scrollbarWidth || '15px';
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
    // touch devices do not have a scrollbar so remove it from the calculation
    '@media (pointer: coarse)': {
      [className]: {
        'margin-left': `calc(50% - 50vw + ${gutter})`,
        'margin-right': `calc(50% - 50vw + ${gutter})`,
        'max-width': `calc(100vw - ${gutter} * 2)`,
      },
    }
  };

  if (sizer && contentWidth) {
    const sideWidth = `(100vw - 100%)`;
    // to be 100% correct we should take the scrollbar into account but it's
    // such a small overlap that we do not mind

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
    // to be 100% correct we should take the scrollbar into account but it's
    // such a small overlap that we do not mind

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
  const { alignwide, alignfull, alignleftright, ...defaults } = theme('gutenberg.alignments');

  if (alignwide) {
    addComponents(alignmentStyling('.alignwide', {...defaults, ...alignwide}));
  }
  if (alignfull) {
    addComponents(alignmentStyling('.alignfull', {...defaults, ...alignfull}));
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
