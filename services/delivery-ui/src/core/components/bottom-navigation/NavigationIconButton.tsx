import { Link, Text } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { Link as WouterLink } from 'wouter';
import { colors } from '../../theme/colors';

interface NavigationIconButtonProps {
  title: string;
  icon: ReactElement;
  href: string;
  isActive: boolean;
}

export const NavigationIconButton = ({
  title,
  icon,
  href,
  isActive,
}: NavigationIconButtonProps) => {
  return (
    <WouterLink href={href} asChild>
      <Link
        display="flex"
        flexDirection="column"
        alignItems="center"
        flexGrow="1"
        overflow="hidden"
        textDecoration="none !important"
        color={isActive ? colors.primary : colors.muted}
      >
        <Text fontSize="1.8rem">{icon}</Text>
        <Text letterSpacing="-0.04em">{title}</Text>
      </Link>
    </WouterLink>
  );
};
