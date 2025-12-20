import React from "react";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path
      fill="#EA4335"
      d="M24 9.5c3.1 0 5.9 1.1 8.1 3.1l6-6C34.5 2.5 29.6 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.1 5.5C11.6 13.3 17.3 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.1 24.5c0-1.7-.1-3-.4-4.3H24v8.2h12.6c-.6 3-2.3 5.5-4.9 7.2l7.4 5.7c4.3-4 7-9.9 7-16.8z"
    />
    <path
      fill="#FBBC05"
      d="M9.6 28.8c-.6-1.7-1-3.5-1-5.3s.4-3.6 1-5.3l-7.1-5.5C.9 16.3 0 20.1 0 24s.9 7.7 2.5 11.3l7.1-5.5z"
    />
    <path
      fill="#34A853"
      d="M24 48c5.6 0 10.3-1.9 13.7-5.2l-7.4-5.7c-2 1.4-4.6 2.2-6.3 2.2-6.7 0-12.4-3.8-14.4-9.3l-7.1 5.5C6.4 42.6 14.6 48 24 48z"
    />
  </svg>
);

const GoogleButton = ({ onClick, text }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 border border-white/20 rounded-lg py-3 text-white hover:bg-white/10 transition"
    >
      <GoogleIcon />
      <span className="font-medium">{text}</span>
    </button>
  );
};

export default GoogleButton;
