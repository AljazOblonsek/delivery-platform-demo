import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { MockPackageCard } from '../components/MockPackageCard';
import { MOCK_PACKAGES } from '../constants/mock-packages.constant';

export const MockPackagesPage = () => {
  return (
    <Box marginTop="3.5rem" marginBottom="4.2rem">
      <Box paddingX="2rem">
        <Heading>Mock Packages</Heading>
        <Text fontSize="lg">
          Scan QR codes for unique packages or manually enter the details you can find below each
          code.
        </Text>
        <SimpleGrid marginTop="1.7rem" spacing="2rem" columns={{ base: 1, sm: 2, md: 4 }}>
          {MOCK_PACKAGES.map((mockPackage) => (
            <MockPackageCard key={mockPackage.id} mockPackage={mockPackage} />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};
