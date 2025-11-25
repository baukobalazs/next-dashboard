"use client";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { authenticate } from "../lib/actions";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import ThemeToggle from "@/app/ui/ThemeToggle";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(2),
  position: "relative",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    background:
      "radial-gradient(circle at 30% 20%, hsl(210, 100%, 98%) 0%, transparent 50%), " +
      "radial-gradient(circle at 70% 60%, hsl(210, 100%, 96%) 0%, transparent 50%), " +
      "radial-gradient(circle at 50% 50%, hsl(210, 80%, 98%) 0%, hsl(0, 0%, 100%) 100%)",
    ...theme.applyStyles("dark", {
      background:
        "radial-gradient(circle at 50% 50%, hsla(210, 100%, 16%, 0.4) 0%, transparent 100%), " +
        "radial-gradient(circle at 50% 50%, hsla(220, 70%, 12%, 0.3) 0%, transparent 100%), " +
        "radial-gradient(circle at 50% 50%, hsl(220, 30%, 8%) 0%, hsl(220, 30%, 5%) 100%)",
    }),
  },
}));

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <Box sx={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 1000 }}>
        <ThemeToggle />
      </Box>

      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Sign in
        </Typography>

        <Box
          component="form"
          action={formAction}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              disabled={isPending}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              disabled={isPending}
            />
          </FormControl>

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
            disabled={isPending}
          />

          <input type="hidden" name="redirectTo" value={callbackUrl} />

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </Box>

        <Divider>or</Divider>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert("Sign in with Google")}
            startIcon={<GoogleIcon />}
          >
            Sign in with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert("Sign in with Facebook")}
            startIcon={<FacebookIcon />}
          >
            Sign in with Facebook
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </Typography>
        </Box>
      </Card>
    </SignInContainer>
  );
}
