import '@fortawesome/fontawesome-svg-core/styles.css';
import { Stack } from '@chakra-ui/react';
import { config } from '@fortawesome/fontawesome-svg-core';
import type { Metadata } from 'next';
import { Providers } from '@/app/providers';

// prevent fontawesome from adding its CSS since we added it manually: import '@fortawesome/fontawesome-svg-core/styles.css';
// this is to avoid css duplication (from fa icons & chakra)
config.autoAddCss = false;

export const metadata: Metadata = {
  title: 'Delivery tracking',
  description: 'App for tracking packages supported by blockchain technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Stack paddingY={[16, 12]} paddingX={[8]} height={'100vh'}>
            {children}
          </Stack>
        </Providers>
      </body>
    </html>
  );
}
