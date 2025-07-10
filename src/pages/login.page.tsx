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
import { setUserCredentials } from "../redux/slices/auth.slice";
import { useLocation, useNavigate } from "react-router-dom";
// import { useLoginMutation } from "../redux/api/userSlice";
import useAuth from "../hooks/use-auth.hook";
import { showSuccess } from "../components/common/toast/toast";

interface LoginProps {
  onLoginSuccess?: (username: string) => void;
}

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(4),
//   borderRadius: theme.shape.borderRadius,
//   maxWidth: 400,
//   [theme.breakpoints.up("sm")]: {
//     maxWidth: 450,
//   },
//   [theme.breakpoints.up("md")]: {
//     maxWidth: 500,
//   },
//   width: "100%",
//   boxShadow: theme.shadows[3],
//   transition: theme.transitions.create(["box-shadow"]),
//   "&:hover": {
//     boxShadow: theme.shadows[6],
//   },
// }));

const Login = ({ onLoginSuccess }: LoginProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  // const [login] = useLoginMutation();
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
          setUserCredentials({
            user: {
              email: "email",
              id: 1,
              username: credentials.username,
            },
            token: "tokenOfGranitite",
          }),
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
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: (theme) => theme.palette.grey[100],
        padding: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container maxWidth="sm">
        <Stack gap={1}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Welcome Back!
          </Typography>
          <img
            alt="logo"
            src={`/logo.jpeg`}
            style={{ width: 100, margin: "0 auto", borderRadius: "8px" }}
          />

          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ mb: 3 }}
          >
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
            sx={{ mt: 3, py: 1.5 }}
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
