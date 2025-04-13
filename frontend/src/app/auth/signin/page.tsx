"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/service/auth.service";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

interface AuthError {
  message: string;
}

export default function SigninPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.signin({ email, password });
      if (response.user) {
        setUser({
          id: response.user.id,
          fullname: response.user.fullname,
          email: response.user.email,
          role: response.user.role,
        });
        router.push("/dashboard");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } catch (err: unknown) {
      const error = err as AuthError;
      console.log(error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full max-w-md p-4">
      <div className="flex flex-col mb-4 animate-appear">
        <h1 className="text-2xl font-bold mb-2">Welcome back to SelfAI</h1>
        <p className="text-muted-foreground">
          Manage your AI agent, track engagement, and connect smarter
        </p>
      </div>

      <div className="flex gap-4 mb-4 animate-appear">
        <Button variant="outline" className="flex-1 gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </Button>
        <Button variant="outline" className="flex-1 gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-black">
            <path
              fill="currentColor"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
            />
          </svg>
          Sign in with Apple
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-8 animate-appear">
        <div className="h-[1px] flex-1 bg-gray-200"></div>
        <span className="text-sm text-muted-foreground">or</span>
        <div className="h-[1px] flex-1 bg-gray-200"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="text-sm text-red-500 text-center">{error}</div>
        )}
        <div className="animate-appear">
          <label className="block text-sm font-medium mb-2">
            Email address
          </label>
          <Input
            name="email"
            placeholder="e.g. hi@yourcompany.com"
            type="email"
            required
            disabled={isLoading}
          />
        </div>
        <div className="animate-appear">
          <label className="block text-sm font-medium mb-2">Password</label>
          <Input
            name="password"
            placeholder="Enter your password"
            type="password"
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-between items-center animate-appear">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm text-muted-foreground">
              Remember me
            </Label>
          </div>
          <Link
            href="#"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 animate-appear"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground animate-appear">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="text-indigo-600 hover:text-indigo-500"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
