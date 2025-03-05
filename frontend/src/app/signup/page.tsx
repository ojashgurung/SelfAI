"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/service/auth";
import { TokenService } from "@/lib/utils/utils";

export default function SignupPage() {
  const id = useId();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    console.log(formData);

    try {
      const response = await authService.signup({
        fullname: formData.get("fullname") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });
      // Store tokens in cookies
      if (response.access_token && response.refresh_token) {
        TokenService.setTokens(response.access_token, response.refresh_token);
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed left-1/2 top-1/2 z-[101] grid max-h-[calc(100%-4rem)] w-full -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto border bg-background p-6 shadow-lg shadow-black/5 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-[400px] sm:rounded-xl">
      <div className="flex flex-col items-center gap-2">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border animate-appear"
          aria-hidden="true"
        >
          <svg
            className="stroke-zinc-800 dark:stroke-zinc-100"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
          </svg>
        </div>
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <div className="text-lg font-semibold tracking-tight sm:text-center animate-appear">
            Sign up Origin UI
          </div>
          <div className="text-sm text-muted-foreground sm:text-center animate-appear">
            We just need a few details to get you started.
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="text-sm text-red-500 text-center">{error}</div>
        )}
        <div className="space-y-4">
          <div className="space-y-2 animate-appear">
            <Label htmlFor={`${id}-name`}>Full name</Label>
            <Input
              id={`${id}-name`}
              name="fullname"
              placeholder="e.g. John Doe"
              type="text"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2 animate-appear">
            <Label htmlFor={`${id}-email`}>Email</Label>
            <Input
              id={`${id}-email`}
              name="email"
              placeholder="e.g. hi@yourcompany.com"
              type="email"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2 animate-appear">
            <Label htmlFor={`${id}-password`}>Password</Label>
            <Input
              id={`${id}-password`}
              name="password"
              placeholder="Enter your password"
              type="password"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full animate-appear"
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </Button>
      </form>

      <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
        <span className="text-xs text-muted-foreground">Or</span>
      </div>

      <Button variant="outline" className="animate-appear">
        Continue with Google
      </Button>

      <p className="text-center text-xs text-muted-foreground animate-appear">
        By signing up you agree to our{" "}
        <a className="underline hover:no-underline" href="#">
          Terms
        </a>
        .
      </p>
    </div>
  );
}
