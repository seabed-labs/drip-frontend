import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { mode, Styles } from '@chakra-ui/theme-tools';

const styles: Styles = {
  global: (props) => ({
    body: {
      bg: mode('gray.800', '#101010')(props)
    }
  })
};

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false
};

export const theme = extendTheme({ config, styles });
