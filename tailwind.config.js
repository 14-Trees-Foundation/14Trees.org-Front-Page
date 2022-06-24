//tailwind border color plugin powered by
//https://github.com/tailwindcss/tailwindcss/pull/560#issuecomment-503222143
var _ = require('lodash')
var flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default
const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  purge: {
    content:["./src/**/*.html", "./src/**/*.vue", "./src/**/*.jsx"],
    options: {
      whitelist: [
        'bg-opacity-0',
        'bg-opacity-25',
        'bg-opacity-50',
        'bg-opacity-75',
        'bg-opacity-100',
      ]
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  theme: {
    extend: {
      variants: {
        height: ['hover', 'focus']
      },
      colors: {
        'dark-green': '#1F3625',
        'light-green': 'hsl(78deg 62% 53%)',
        'dark-grey': '#1b1f23',
        'darker-grey': '#181d21',
        'mud-brown': '#967A63',
        'mud-grey': '#AB9E8D',
        'darkish-grey': '#16191c',
        'warm-light-grey': 'hsl(80deg 7% 92%)',
        'primary-green': {
          1 : '#1b1f23',
          2 : '#9acd9a',
        }
      },
      spacing: {
        '1/2' : '50%',
        '1/3' : '33.333333%',
        '2/3' : '66.666667%',
        '3/4' : '75%',
        '9/16' : '56.25%',
        'full' : '100%'
      },
      transitionProperty: {
        'height': 'height'
      },
      height: {
        '128': '32rem',
        'half-screen': '50vh'
      },
      minHeight: {
        '0': '0',
        '1/4-screen': '25vh',
        '1/2-screen': '50vh',
        '3/4-screen': '75vh',
      },
      maxHeight: {
        '0': '0',
        '1/4-screen': '25vh',
        '1/2-screen': '50vh',
        '3/4-screen': '75vh',
      },
      margin: {
        '-1/2-hscreen': '-50vh',
        '1/2-hscreen': '50vh',
        '-1/2-wscreen': '-50vw',
        '1/2-wscreen': '50vw',
      },
      scale: {
        '101': '1.01',
        '102': '1.02'
      },
      inset: {
        '0': 0,
        '1/2': '50%',
      },
      backgroundOpacity: {
        '0': '0',
        '10': '0.1',
        '20': '0.2',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '80': '0.8',
        '90': '0.9',
        '100': '1'
      }
    },
    flexGrow: {
      '0': 0,
      DEFAULT: 1, 
      '2': 2
    },
    fontFamily: {
      sans: [
        '"Helvetica Neue"',
        '"Source Sans Pro"',
        '"Segoe UI"',
        'Roboto',
        'Arial',
        '"Noto Sans"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      mono: ['Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
    },
    zIndex: {
      '-10': '-10',
      '0': 0,
      '10': 10,
      '20': 20,
      '30': 30,
      '40': 40,
      '50': 50,
      '25': 25,
      '50': 50,
      '75': 75,
      '100': 100,
      '1000': 1000,
      'auto': 'auto',
    },
    boxShadow: {
      default: '0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px 0 rgba(0, 0, 0, .06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -1px rgba(0, 0, 0, .06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -2px rgba(0, 0, 0, .05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, .1), 0 10px 10px -5px rgba(0, 0, 0, .04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, .25)',
      '2xl-strong': '0 25px 50px -12px rgba(0, 0, 0, .5)',
      '3xl': '0 35px 60px -15px rgba(0, 0, 0, .3)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
      focus: '0 0 0 3px rgba(66, 153, 225, 0.5)',
      'none': 'none',
    }
  },
  corePlugins: {
    container: false
  },
}