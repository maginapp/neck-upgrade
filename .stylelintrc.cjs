module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier'],
  plugins: ['stylelint-order'],
  rules: {
    'length-zero-no-unit': [true, { ignore: ['custom-properties'] }],
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'media-feature-range-notation': null,
    'order/order': [
      'custom-properties',
      'dollar-variables',
      'declarations',
      {
        type: 'at-rule',
        name: 'include',
      },
      {
        type: 'at-rule',
        name: 'media',
      },
      'rules',
    ],
    'order/properties-order': [
      // Positioning
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',

      // Display & Box Model
      'display',
      'flex',
      'flex-grow',
      'flex-shrink',
      'flex-basis',
      'grid',
      'grid-area',
      'grid-template',
      'grid-template-columns',
      'grid-template-rows',
      'grid-template-areas',
      'gap',
      'place-content',
      'place-items',

      'float',
      'clear',
      'box-sizing',

      // Dimensions
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',

      'margin',
      'padding',

      // Borders
      'border',
      'border-width',
      'border-style',
      'border-color',
      'border-radius',

      // Typography
      'font',
      'font-size',
      'font-weight',
      'line-height',
      'letter-spacing',
      'text-align',
      'text-decoration',
      'color',

      // Background
      'background',
      'background-color',
      'background-image',
      'background-size',
      'background-position',
      'background-repeat',

      // Typography
      'font',
      'font-size',
      'font-weight',
      'line-height',
      'letter-spacing',
      'text-align',
      'color',
      'text-decoration',

      // Visual
      'opacity',
      'visibility',
      'box-shadow',

      // Animation
      'transition',
      'transform',

      // Others
      'cursor',
      'overflow',
      'user-select',
    ],
    'no-empty-source': null,
    'selector-class-pattern': '^[a-zA-Z0-9\\-_]+$',
  },
};
