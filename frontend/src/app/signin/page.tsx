"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/service/auth";

export default function SigninPage() {
  const id = useId();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      const response = await authService.signin({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });
      if (response.user) {
        router.push("/dashboard");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed left-1/2 top-1/2 z-[101] grid max-h-[calc(100%-4rem)] w-full -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto border bg-background p-6 shadow-lg shadow-black/5 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-[400px] sm:rounded-xl">
      <div className="flex-col items-center gap-2 flex">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-full  border border-border"
          aria-hidden="true"
        >
          <svg
            className="stroke-zinc-800 dark:stroke-zinc-100 animate-appear"
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
            Welcome back
          </div>
          <div className="text-sm text-muted-foreground sm:text-center animate-appear">
            Enter your credentials to login to your account.
          </div>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2 animate-appear">
            <Label htmlFor={`${id}-email`}>Email</Label>
            <Input
              id={`${id}-email`}
              name="email"
              placeholder="hi@yourcompany.com"
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
        <div className="flex justify-between gap-2 animate-appear">
          <div className="flex items-center gap-2">
            <Checkbox id={`${id}-remember`} />
            <Label
              htmlFor={`${id}-remember`}
              className="font-normal text-muted-foreground"
            >
              Remember me
            </Label>
          </div>
          <a className="text-sm underline hover:no-underline" href="#">
            Forgot password?
          </a>
        </div>
        {error && (
          <div className="text-sm text-red-500 text-center">{error}</div>
        )}
        <Button
          type="submit"
          className="w-full animate-appear"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
        <span className="text-xs text-muted-foreground">Or</span>
      </div>

      <Button variant="outline" className="animate-appear">
        Login with Google
      </Button>
    </div>
  );
}
