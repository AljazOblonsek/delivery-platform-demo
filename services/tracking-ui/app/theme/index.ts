import { extendTheme } from '@chakra-ui/react';
import { colors } from '@/app/theme/colors';
import { buttonTheme } from './button';

export const theme = extendTheme({
  components: { Button: buttonTheme },
  ...colors,
});
