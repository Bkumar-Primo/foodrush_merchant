import { BRAND_COLORS } from "@/lib/constants/brand-colors";

export const AUTH_COPY = {
  welcomeTitle: "Welcome Back!",
  welcomeSubtitle: "Sign in to your merchant dashboard",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  passwordLabel: "Password",
  passwordPlaceholder: "Enter your password",
  rememberMe: "Remember me",
  forgotPassword: "Forgot Password?",
  signIn: "Sign In",
  orContinueWith: "or continue with",
  noAccount: "Don't have an account?",
  signUp: "Sign up",
  signUpTitle: "Create Account",
  signUpSubtitle: "Register your merchant account",
  signUpButton: "Sign Up",
  hasAccount: "Already have an account?",
  signInLink: "Sign in",
  forgotTitle: "Reset Password",
  forgotSubtitle: "We'll send a reset link to your email",
  sendReset: "Send Reset Link",
  backToSignIn: "Back to sign in",
  resetSent: "Password reset email sent. Check your inbox.",
  signingIn: "Signing in...",
  creatingAccount: "Creating account...",
  marketplaceLogin: "Marketplace login",
  marketplaceSoon: "Marketplace login coming soon.",
} as const;

export const AUTH_ROUTES = {
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  dashboard: "/",
} as const;

export const AUTH_COLORS = {
  pageBg: BRAND_COLORS.background,
  primary: BRAND_COLORS.primary,
  primaryHover: BRAND_COLORS.primaryDark,
} as const;
