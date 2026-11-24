"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link has expired or already been used.",
    Default: "An error occurred during authentication.",
    CredentialsSignin: "Invalid email or password.",
  };

  const message = error
    ? errorMessages[error] || errorMessages.Default
    : errorMessages.Default;

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/auth/signin"
            className="px-6 py-2.5 bg-[#01875F] text-white rounded-full text-sm font-medium hover:bg-[#016d4d]"
          >
            Try again
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:border-gray-300"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
