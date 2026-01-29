import { useEffect, useState, type FormEvent } from 'react';
import { TextField, Button, Container, Stack } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import { useLocation, useNavigate } from 'react-router-dom';
import authApi from '../api/auth.api';
import useUser from '@/core/hooks/user-user.hook';
import { notifyError } from '@/core/components/common/toast/toast';
import { authActions } from '@/core/slices/auth/auth.slice';
import STRINGS from '@/core/constants/strings.constant';
import { useAppDispatch } from '@/core/store/root.store.types';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token, id } = useUser();
  const [credentials, setCredentials] = useState({
    password: '',
    phone: '',
  });

  const [loginAsync, { isLoading }] = authApi.useLoginMutation();

  useEffect(() => {
    const from = location?.state?.from || '/';
    if (id && token) navigate(from, { replace: true });
  }, [navigate, id, token, location?.state?.from]);

  const handleChange = (e: any) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    const { data, error } = await loginAsync(credentials);
    if (error) {
      console.log(error);

      return notifyError(error);
    }
    dispatch(authActions.setUser(data));
  };

  return (
    <Container
      sx={{
        px: 2,
        mx: 'auto',
        height: '100vh',
      }}
      maxWidth="xs"
    >
      <Stack
        sx={{
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Stack gap={1}>
          <img alt="logo" src={`/logo.jpeg`} style={{ width: 200, margin: '0 auto', borderRadius: '8px' }} />
        </Stack>

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <Stack gap={2}>
            <TextField
              name="phone"
              label={STRINGS.phone_number}
              fullWidth
              value={credentials.phone}
              onChange={handleChange}
              required
              autoFocus
              slotProps={{
                input: {
                  startAdornment: <PersonIcon />,
                },
              }}
              disabled={isLoading}
            />
            <TextField
              name="password"
              label={STRINGS.password}
              type="password"
              fullWidth
              value={credentials.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              slotProps={{
                input: {
                  startAdornment: <KeyIcon />,
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading || !credentials.password || !credentials.password}
            >
              {STRINGS.login}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
};

export default LoginPage;
