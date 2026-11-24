"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-10">
      <div className="w-full max-w-[450px] rounded-[28px] border border-[#dadce0] bg-white px-6 py-10 sm:px-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
            <svg viewBox="0 0 40 40" className="h-12 w-12" aria-hidden="true">
              <path fill="#EA4335" d="M8.7 4.6c-.4.5-.7 1.2-.7 2.1v26.6c0 .9.3 1.6.7 2.1l.1.1 14.9-14.9v-.3L8.8 4.5l-.1.1z"/>
              <path fill="#FBBC04" d="M28.6 25.3l-5-5v-.3l5-5 .1.1 5.9 3.4c1.7 1 1.7 2.5 0 3.5l-6 3.3z"/>
              <path fill="#4285F4" d="M28.7 25.2L23.6 20 8.7 34.9c.5.6 1.4.7 2.4.1l17.6-9.8z"/>
              <path fill="#34A853" d="M28.7 14.8L11.1 5C10.1 4.4 9.2 4.5 8.7 5.1L23.6 20l5.1-5.2z"/>
            </svg>
          </div>
          <h1 className="text-[28px] font-normal leading-9 text-[#202124]">Sign in</h1>
          <p className="mt-2 text-base text-[#202124]">to continue to Google Play</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-[#f9dedc] bg-[#fce8e6] px-4 py-3 text-sm text-[#b3261e]">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-[#3c4043]">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
              className="h-12 rounded-lg border-[#dadce0] px-4 text-base focus-visible:ring-[#01875f]/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-[#3c4043]">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="h-12 rounded-lg border-[#dadce0] px-4 pr-11 text-base focus-visible:ring-[#01875f]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#5f6368] hover:bg-[#f1f3f4]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link href="/auth/forgot-password" className="text-sm font-medium text-[#01875f] hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <Link href="/auth/signup" className="text-sm font-medium text-[#01875f] hover:underline">
              Create account
            </Link>
            <Button type="submit" className="h-10 rounded-lg px-6 text-sm font-medium" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
