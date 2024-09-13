import { extendTheme } from '@chakra-ui/react';
import { colors } from './colors';
import '@fontsource/roboto';

export const theme = extendTheme({
  components: {
    Button: {
      variants: {
        solid: {
          backgroundColor: colors.primary,
          color: 'white',
          borderRadius: 'md',
          fontWeight: 'base',
          letterSpacing: '0.03em',
          _hover: {
            backgroundColor: colors.primaryHover,
          },
          _active: {
            backgroundColor: colors.primaryHover,
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          border: '2px solid',
          borderColor: colors.muted,
          _hover: {
            borderColor: colors.primary,
          },
          _focusVisible: {
            borderColor: colors.primary,
          },
        },
      },
      variants: {
        filled: {
          field: {
            border: '2px solid',
            borderColor: colors.primary,
            backgroundColor: colors.muted,
            _hover: {
              backgroundColor: colors.muted,
            },
          },
        },
      },
      defaultProps: {
        variant: null,
      },
    },
    FormLabel: {
      baseStyle: {
        display: 'inline',
        paddingLeft: '0.1rem',
      },
    },
    Link: {
      baseStyle: {
        color: colors.link,
        _hover: {
          textDecoration: 'underline',
        },
      },
    },
  },
  fonts: {
    heading: 'Roboto, sans-serif',
    body: 'Roboto, sans-serif',
  },
  semanticTokens: {
    colors: {
      'chakra-body-text': colors.primary,
    },
  },
});
