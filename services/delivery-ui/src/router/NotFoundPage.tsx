import { Box, Button, Text } from '@chakra-ui/react';
import { HiOutlineEmojiSad } from 'react-icons/hi';
import { Link as WouterLink } from 'wouter';
import { Routes, colors } from '@/core';

export const NotFoundPage = () => {
  return (
    <Box marginTop="8rem">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Text fontSize="10rem">
          <HiOutlineEmojiSad />
        </Text>
        <Text as="h1" fontSize="3rem" fontWeight="bold" letterSpacing="0.2rem" marginTop="0.6rem">
          404
        </Text>
        <Text color={colors.primary}>Sorry, we were unable to find that page.</Text>

        <WouterLink href={Routes.Home} asChild>
          <Button marginTop="1.5rem" width={{ base: '70%', md: '40%' }}>
            Go home
          </Button>
        </WouterLink>
      </Box>
    </Box>
  );
};
