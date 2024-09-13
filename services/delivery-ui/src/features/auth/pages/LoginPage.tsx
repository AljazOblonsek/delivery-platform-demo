import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useImperativeHandle, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { LoginSchema, loginSchema } from '../schemas/login.schema';
import { LoginResponse } from '../types/login-response.type';
import { ApiRoutes, LocalStorageKey, apiFetch, getJwtPayloadFromJwt, useAuthStore } from '@/core';

const loginResolver = zodResolver(loginSchema);

export const LoginPage = () => {
  const form = useForm<LoginSchema>({ resolver: loginResolver });
  const { ref: formRegisterPasswordRef, ...formRegisterPasswordRest } = form.register('password');
  const { isOpen: isPasswordOpen, onToggle: onPasswordToggle } = useDisclosure();
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const { authenticate } = useAuthStore((state) => ({ authenticate: state.authenticate }));

  useImperativeHandle(formRegisterPasswordRef, () => passwordInputRef.current);

  const onPasswordInputRevealClick = () => {
    onPasswordToggle();

    if (passwordInputRef.current) {
      passwordInputRef.current.focus({ preventScroll: true });
    }
  };

  const onSubmit = async (data: LoginSchema) => {
    form.clearErrors('root');

    try {
      const fetchResponse = await apiFetch(ApiRoutes.Login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!fetchResponse.ok) {
        form.setError('root', { message: 'Wrong email or password.' });
        return;
      }

      const response = (await fetchResponse.json()) as LoginResponse;

      const jwtPayload = getJwtPayloadFromJwt(response.accessToken);

      if (!jwtPayload) {
        form.setError('root', { message: 'An unknown error occurred (ERR_CODE 1).' });
        return;
      }

      localStorage.setItem(LocalStorageKey.AccessToken, response.accessToken);
      authenticate(response.accessToken, {
        id: jwtPayload.id,
        email: jwtPayload.email,
        firstname: jwtPayload.firstname,
        lastname: jwtPayload.lastname,
        companyId: jwtPayload.companyId,
        companyName: jwtPayload.companyName,
      });
    } catch (e: unknown) {
      form.setError('root', { message: 'An unknown error occurred (ERR_CODE 2).' });
    }
  };

  return (
    <Container
      minHeight="100dvh"
      minW="100%"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="0"
    >
      <Container maxW="xl" py={{ base: '28' }} px={{ base: '0', sm: '8' }}>
        <Stack
          spacing="8"
          bg={{ base: 'transparent', md: 'bg.surface' }}
          boxShadow={{ base: 'none', md: 'md' }}
          borderRadius={{ base: 'none', md: 'xl' }}
        >
          <Stack spacing="6">
            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
              <Heading size={{ base: 'lg', md: 'xl' }}>Delivery Platform</Heading>
              <Text color="blackAlpha.800" fontSize={{ base: 'md', md: 'xl' }}>
                Login to start your work shift.
              </Text>
            </Stack>
          </Stack>
          <Box py={{ base: '0', sm: '8' }} px={{ base: '4', sm: '10' }}>
            <Stack spacing={6} as="form" onSubmit={form.handleSubmit(onSubmit)}>
              <Stack spacing={5}>
                <FormControl isInvalid={!!form.formState.errors.email}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="text"
                    data-testid="email-input"
                    {...form.register('email')}
                  />
                  <FormErrorMessage data-testid="email-error">
                    {form.formState.errors.email?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!form.formState.errors.password}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <InputGroup>
                    <InputRightElement>
                      <IconButton
                        variant="text"
                        aria-label={isPasswordOpen ? 'Mask password' : 'Reveal password'}
                        icon={isPasswordOpen ? <HiEyeOff /> : <HiEye />}
                        onClick={onPasswordInputRevealClick}
                      />
                    </InputRightElement>
                    <Input
                      id="password"
                      type={isPasswordOpen ? 'text' : 'password'}
                      autoComplete="current-password"
                      ref={passwordInputRef}
                      data-testid="password-input"
                      {...formRegisterPasswordRest}
                    />
                  </InputGroup>
                  <FormErrorMessage data-testid="password-error">
                    {form.formState.errors.password?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!form.formState.errors.root}>
                  <FormErrorMessage data-testid="root-error">
                    {form.formState.errors.root?.message}
                  </FormErrorMessage>
                </FormControl>
              </Stack>

              <Button
                isLoading={form.formState.isSubmitting}
                type="submit"
                data-testid="login-button"
              >
                Login
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Container>
  );
};
