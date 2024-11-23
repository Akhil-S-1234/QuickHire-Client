// components/GoogleLoginButton.tsx
"use client";

import React from "react";

interface GoogleLoginButtonProps {
  onClick: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center w-full px-4 py-2 mb-4 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
  >
    <img
      src="https://w7.pngwing.com/pngs/249/19/png-transparent-google-logo-g-suite-google-guava-google-plus-company-text-logo.png"
      alt="Google"
      className="w-5 h-5 mr-2"
    />
    Continue with Google
  </button>
);

export default GoogleLoginButton;
