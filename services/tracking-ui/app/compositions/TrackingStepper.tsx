'use client';

import {
  Box,
  Stack,
  Step,
  StepDescription,
  StepIndicator,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
  useSteps,
} from '@chakra-ui/react';
import { faBox, faCheck, faTruck } from '@fortawesome/free-solid-svg-icons';
import { ReactNode } from 'react';
import IconWrapper from '@/app/components/IconWrapper';
import { colors } from '@/app/theme/colors';
import { PackageStatus } from '@/lib/enums/package-status.enum';
import { PackageHistoryType } from '@/lib/schemas/packageHistory.schema';

type TrackingStepperProps = {
  history: PackageHistoryType;
};

type PackageStatusDataType = {
  description: string;
  icon?: ReactNode;
};

const PackageStatusData: Record<PackageStatus, PackageStatusDataType> = {
  [PackageStatus.InWarehouse]: {
    description: 'Your package is still in warehouse.',
    icon: <IconWrapper icon={faBox} />,
  },
  [PackageStatus.InDelivery]: {
    description: 'Your package is currently in delivery.',
    icon: <IconWrapper icon={faTruck} />,
  },
  [PackageStatus.Delivered]: {
    description: 'Your package was successfully delivered.',
    icon: <IconWrapper icon={faCheck} />,
  },
};

const getPackageStatusData = (status: PackageStatus) => {
  return PackageStatusData[status] || { description: status, icon: <div></div> };
};

export const TrackingStepper = ({ history }: TrackingStepperProps) => {
  const { activeStep } = useSteps({
    index: history.length,
    count: history.length,
  });

  const title = history[0].title;
  const deliveryCompany = history[0].companyName;

  return (
    <Stack spacing={4}>
      <Stack alignItems="center" spacing={0}>
        <Text fontWeight="bold">{title}</Text>
        <Text as={'span'} color={colors.muted}>
          Delivered by {deliveryCompany}
        </Text>
      </Stack>
      <Stepper
        colorScheme={'stepperColor'}
        index={activeStep}
        orientation="vertical"
        height={['400px', '350px']}
        gap={'0'}
      >
        {history.map((location, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus complete={getPackageStatusData(location.status).icon} />
            </StepIndicator>
            <Box flexShrink="0">
              <StepTitle>{getPackageStatusData(location.status).description}</StepTitle>
              <StepDescription>{new Date(location.updatedAt).toLocaleString()}</StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
};
