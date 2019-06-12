# tailwindcss-gutenberg

This plugin adds unopinionated utilities and components for the Gutenberg Block Editor. It's purpose is not to style the actual blocks which you can either do yourself or let WordPress handle for you with [`add_theme_support('wp-block-styles');`](https://developer.wordpress.org/block-editor/developers/themes/theme-support/#default-block-styles). If you want a plugin that will let you style the actual blocks as components, have a look at [tailwind-gutenberg-components](https://github.com/kellymears/tailwind-gutenberg-components).

Personally I encourage you to try working with WordPress own block styling as it will make it easier to include your entire stylesheet in the block editor and have your styles applied on both the front-end and the back-end.

By using the core styling and this plugin you're basically left with minor adjustments, styling buttons and defining gutters between blocks. All of which are too opinionated for any plugin to handle.

### Features:

##### gutenberg.colors

Block Color Palette utility classes `has-X-background-color`, `has-Y-color`.

##### gutenberg.foregroundColors

Low specificity foreground color components for the background color classes `has-X-background-color`. It will pick a foreground color with high contrast so a dark color is used on light backgrounds and vice versa. This might require you to inherit the color value on some block subelements.

If you need to be more specific, just add a custom style to your stylesheet, this is just meant for a decent out-of-the-box experience.

##### gutenberg.fontSizes

Block Font Size utility classes `has-X-font-size`.

##### gutenberg.alignments

Add the otherwise missing alignment components for alignwide and alignfull as well as responsive versions of alignleft and alignright.

<img src="https://i.imgur.com/xwCnjVz.gif" width="640" height="400">

This styling depends on the wrapper having a width and then `alingwide` and `alignfull` will break out of it. You might also need to hide `overflow-x` on the html element.

##### gutenberg.admin

Fix some bugs in the block editor back-end that haven't been fixed upstream and reset the alignment styling added here so they do not break the editor experience.

This assumes you're enqueuing the entire stylesheet with [`add_editor_style`](https://developer.wordpress.org/block-editor/developers/themes/theme-support/#enqueuing-the-editor-style).

### Example

```js
const gutenberg = require('tailwindcss-gutenberg');

module.exports = {
  theme: {
    // ....
    gutenberg: (theme) => ({

      // Create block color palette utility classes that WordPress uses.
      // @link https://developer.wordpress.org/block-editor/developers/themes/theme-support/#block-color-palettes
      colors: {
        primary: theme('colors.primary'),
        secondary: theme('colors.secondary'),
        black: theme('colors.black'),
        white: theme('colors.white'),
      },

      // If set, will pick the color with most contrast as the foreground text
      // color for block background color components.
      foregroundColors: [
        theme('colors.black'),
        theme('colors.white'),
      ],

      // Create block font size utility classes that WordPress uses.
      // https://developer.wordpress.org/block-editor/developers/themes/theme-support/#block-font-sizes
      fontSizes: {
        xs: theme('fontSize.xs'),
        sm: theme('fontSize.sm'),
        base: theme('fontSize.base'),
        xl: theme('fontSize.xl'),
        xxl: theme('fontSize.2xl'),
      },

      alignments: {
        // Scrollbar width which defaults to macOS 0px but requires overflow-x
        // hidden on <html>. If that's a dealbreaker set it to 15px and some
        // users might have a small gutter.
        scrollbarWidth: '15px',

        // Content areas default width without alignments required when using
        // `sizer` property.
        contentWidth: '672px',

        // A max width cap for alignfull and alignwide
        maxWidth: '1600px',

        // Enable with a truthy value
        alignfull: true,

        // Core Group blocks default to 30px side padding.
        backgroundGutter: '30px',

        // Or override the above configurations per alignment type.
        alignwide: {
          // Add a minimum gutter on the left and right of the alignment
          gutter: theme('spacing.1'),

          // Add a sizing factor to fluidly grow the alignment.
          // Use values between 1.0 and 1.99 where lower means tighter to
          // viewport edge and larger means further.
          // NOTE the values of maxWidth, contentWidth and gutter all have
          // to use the same units for this to work. calc() in media queries
          // does not have good browser support
          sizer: 1.25,
        },

        // Add responsive alignleft and alignright support.
        alignleftright: {

          // Screen size when alignment is triggered, defaults to an arbitrary
          // 640px
          minWidth: theme('screens.sm'),

          // Side margin, defaults to core's 1em.
          margin: theme('spacing.2'),
        },
      },
    }),
  },
  plugins: [
    // Block Editor Color Palette utilities
    gutenberg.colors,

    // Block Editor Font Size utilities
    gutenberg.fontSizes,

    // Foreground color components for Block Editor background colors.
    gutenberg.foregroundColors,

    // Alignment support
    gutenberg.alignments,

    // Block Editor back-end styling fixes wrapped as components.
    gutenberg.admin,
  ],
};
```
