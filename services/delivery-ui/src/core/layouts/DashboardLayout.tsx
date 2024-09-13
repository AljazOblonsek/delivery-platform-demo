import { Box, Heading, Text } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { BottomNavigation } from '../components/bottom-navigation/BottomNavigation';

interface DashboardLayoutProps {
  title: string;
  description: string;
  children: ReactElement | ReactElement[];
}

export const DashboardLayout = ({ title, description, children }: DashboardLayoutProps) => (
  <Box marginTop="3.5rem" marginBottom="4.2rem">
    <Box paddingX="2rem">
      <Heading>{title}</Heading>
      <Text fontSize="lg">{description}</Text>
      <Box marginTop="1.7rem">{children}</Box>
    </Box>
    <BottomNavigation />
  </Box>
);
