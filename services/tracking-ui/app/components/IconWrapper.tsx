import { chakra } from '@chakra-ui/react';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo } from 'react';

const IconWrapper = ({ icon }: { icon: IconDefinition }) => {
  const Icon = chakra(FontAwesomeIcon);

  return <Icon color={'black'} icon={icon} />;
};

export default memo(IconWrapper);
