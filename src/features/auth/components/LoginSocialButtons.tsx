"use client";

function GoogleIcon(): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="24"
      height="24"
      aria-label="Google"
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.199 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.959 3.041l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.959 3.041l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.347 4.337-17.694 10.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.104 0 9.786-1.947 13.338-5.121l-6.219-5.238C29.044 35.221 26.614 36 24 36c-5.178 0-9.621-3.329-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.184 5.641l.003-.002 6.219 5.238C36.901 39.203 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

interface LoginSocialButtonsProps {
  onGoogle: () => void;
  onApple: () => void;
  disabled?: boolean;
}

export function LoginSocialButtons({
  onGoogle,
  disabled,
}: LoginSocialButtonsProps): React.JSX.Element {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={onGoogle}
        disabled={disabled}
        className="flex h-11 w-full items-center justify-center rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors disabled:opacity-50"
        aria-label="Sign in with Google"
      >
        <GoogleIcon />
      </button>
    </div>
  );
}
