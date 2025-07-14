import { useEffect, useState, type FormEvent } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Stack,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/use-auth.hook";
import { setUser } from "@/core/slices/auth/auth.slice";
import { showSuccess } from "@/core/components/common/toast/toast";

interface ILoginProps {
  onLoginSuccess?: (username: string) => void;
}
const Login = ({ onLoginSuccess }: ILoginProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [didLoginNow, setDidLoginNow] = useState(false);

  useEffect(() => {
    const from = location?.state?.from || "/";
    if (user && token && !didLoginNow) navigate(from, { replace: true });
  }, [
    location?.state?.from.pathname,
    navigate,
    location?.state,
    didLoginNow,
    user,
    token,
  ]);

  const handleChange = (e: any) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAfterLogin = async () => {
    navigate("/");
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // const loginResponse = await login(credentials).unwrap();
      // console.log("🚀 ~ handleLogin ~ loginResponse:", loginResponse);
      if (
        credentials.username === "zing" &&
        credentials.password === "nignig"
      ) {
        setDidLoginNow(true);
        dispatch(
          setUser({
            user: {
              email: "email",
              id: 1,
              username: credentials.username,
            },
            token: "tokenOfGranitite",
          })
        );
        showSuccess("Form submitted successfully!");
        handleAfterLogin();
        onLoginSuccess?.(credentials.username);
      } else {
        setError("Something is wrong");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        background: (theme) => theme.palette.grey[50],
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container sx={{ px: 2, mx: "auto" }} maxWidth="xs">
        <Stack gap={1}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Welcome Back!
          </Typography>
          <img
            alt="logo"
            src={`/logo.jpeg`}
            style={{ width: 100, margin: "0 auto", borderRadius: "8px" }}
          />

          <Typography variant="body2" color="textSecondary" align="center">
            Please log in to continue.
          </Typography>
        </Stack>

        <form onSubmit={handleLogin}>
          <TextField
            name="username"
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={credentials.username}
            onChange={handleChange}
            required
            autoFocus
            slotProps={{
              input: {
                startAdornment: <PersonIcon />,
              },
            }}
            disabled={loading}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={credentials.password}
            onChange={handleChange}
            required
            disabled={loading}
            slotProps={{
              input: {
                startAdornment: <KeyIcon />,
              },
            }}
          />

          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 2,
                mb: 1,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !credentials.password || !credentials.username}
          >
            {loading ? "Logging In..." : "Log In"}
          </Button>
        </form>
      </Container>
    </Stack>
  );
};

export default Login;
