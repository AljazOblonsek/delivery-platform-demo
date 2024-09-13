import { Card, CardBody, CardHeader, Code, Stack, Text } from '@chakra-ui/react';
import QRCode from 'react-qr-code';
import { MockPackageSchema } from '@/core';

type MockPackageCardProps = {
  mockPackage: MockPackageSchema;
};

export const MockPackageCard = ({ mockPackage }: MockPackageCardProps) => (
  <Card>
    <CardHeader paddingBottom={0} fontWeight="bold">
      {mockPackage.title}
    </CardHeader>
    <CardBody>
      <Stack>
        <QRCode
          size={256}
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          value={JSON.stringify(mockPackage)}
          viewBox={`0 0 256 256`}
        />
        <Code>
          <Text as="span" fontWeight="bold">
            Id:
          </Text>{' '}
          {mockPackage.id}
          <br />
          <Text as="span" fontWeight="bold">
            Title:
          </Text>{' '}
          {mockPackage.title}
        </Code>
      </Stack>
    </CardBody>
  </Card>
);
