"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/service/auth.service";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

interface AuthError {
  response?: {
    data?: {
      detail?: string;
    };
  };
  message?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const fullname = formData.get("fullname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!fullname || !email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.signup({
        fullname,
        email,
        password,
      });
      if (response.user) {
        setUser({
          id: response.user.id,
          fullname: response.user.fullname,
          email: response.user.email,
          role: response.user.role,
        });
        router.push("/dashboard");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || err.message || "Failed to create account";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    try {
      authService.handleOAuthLogin("google");
    } catch (error) {
      setIsLoading(false);
      setError("Failed to initiate Google login");
    }
  };
  return (
    <div className="w-full max-w-md p-4">
      <div className="flex flex-col mb-4 animate-appear">
        <h1 className="text-2xl font-bold mb-2">Create your AI identity</h1>
        <p className="text-muted-foreground">
          Sign up to build an AI-powered profile that actually talks back.
        </p>
      </div>

      <div className="flex  gap-4 mb-4 animate-appear">
        {/* Google */}
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
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
        </Button>
        <Button variant="outline" className="flex-1 gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </Button>
        <Button variant="outline" className="flex-1 gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 fill-[#0A66C2]"
            viewBox="0 0 24 24"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </Button>
      </div>
      <div className="flex items-center gap-4 mb-4 animate-appear">
        <div className="h-[1px] flex-1 bg-gray-200"></div>
        <span className="text-sm text-muted-foreground">or</span>
        <div className="h-[1px] flex-1 bg-gray-200"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="text-sm text-red-500 text-center">{error}</div>
        )}
        <div className="animate-appear">
          <label className="block text-sm font-medium mb-2">Name</label>
          <Input
            name="fullname"
            placeholder="Enter your name"
            type="text"
            required
            disabled={isLoading}
          />
        </div>
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
            placeholder="min 8 chars"
            type="password"
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center gap-2 animate-appear">
          <input type="checkbox" className="rounded border-gray-300" required />
          <label className="text-sm text-muted-foreground">
            I agree to the{" "}
            <Link href="#" className="text-indigo-600 hover:text-indigo-500">
              Terms & Privacy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 animate-appear"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground animate-appear">
        Have an account?{" "}
        <Link
          href="/auth/signin"
          className="text-indigo-600 hover:text-indigo-500"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
