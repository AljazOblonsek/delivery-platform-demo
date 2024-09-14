'use client';

import { ArrowBackIcon } from '@chakra-ui/icons';
import { Heading, HStack, IconButton } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { memo } from 'react';
import Routes from '@/lib/constants/routes';

type NavHeadingProps = {
  title: string;
  linkHome?: boolean;
};

const NavHeading = ({ title, linkHome }: NavHeadingProps) => {
  const router = useRouter();
  return (
    <HStack spacing={2}>
      {linkHome && (
        <IconButton
          variant={'iconButton'}
          onClick={() => {
            router.push(Routes.HOME);
          }}
          aria-label="Go to home page"
          icon={<ArrowBackIcon boxSize={8} />}
        />
      )}
      <Heading size={['lg', 'xl']}>{title}</Heading>;
    </HStack>
  );
};

export default memo(NavHeading);
