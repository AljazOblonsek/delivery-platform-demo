import { Box } from '@chakra-ui/react';
import { HiOutlineCube, HiOutlineHome, HiOutlineUser } from 'react-icons/hi';
import { useLocation } from 'wouter';
import { Routes } from '../../enums';
import { zIndex } from '../../theme';
import { NavigationIconButton } from './NavigationIconButton';

export const BottomNavigation = () => {
  const [location] = useLocation();

  return (
    <Box
      as="nav"
      position="fixed"
      bottom="0"
      width="100%"
      height="4.2rem"
      display="flex"
      alignItems="center"
      px="0.2rem"
      overflowX="auto"
      boxShadow="rgba(0, 0, 0, 0.2) 0 0 3px"
      backgroundColor="white"
      zIndex={zIndex.bottomNavigation}
    >
      <NavigationIconButton
        title="Home"
        icon={<HiOutlineHome />}
        href={Routes.Home}
        isActive={location === Routes.Home}
      />
      <NavigationIconButton
        title="Work"
        icon={<HiOutlineCube />}
        href={Routes.Work}
        isActive={location === Routes.Work}
      />
      <NavigationIconButton
        title="Profile"
        icon={<HiOutlineUser />}
        href={Routes.Profile}
        isActive={location === Routes.Profile}
      />
    </Box>
  );
};
