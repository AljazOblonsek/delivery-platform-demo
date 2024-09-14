import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const baseStyle = {
  backgroundColor: 'gray.900 !important',
  color: 'white !important',
  borderRadius: '4px',
};

const primary = defineStyle({
  ...baseStyle,
  _hover: {
    backgroundColor: 'brand.200',
    color: 'white',
  },
  _disabled: {
    _hover: {
      ...baseStyle,
    },
  },
});

const iconButton = defineStyle({
  backgroundColor: 'white',
  color: 'black',
  border: 'none',
});

export const buttonTheme = defineStyleConfig({
  variants: { primary, iconButton },
});
