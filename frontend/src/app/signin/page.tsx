import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId } from "react";

export default function SigninPage() {
  const id = useId();
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

      <form className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-2 animate-appear">
            <Label htmlFor={`${id}-email`}>Email</Label>
            <Input
              id={`${id}-email`}
              placeholder="hi@yourcompany.com"
              type="email"
              required
            />
          </div>
          <div className="space-y-2 animate-appear">
            <Label htmlFor={`${id}-password`}>Password</Label>
            <Input
              id={`${id}-password`}
              placeholder="Enter your password"
              type="password"
              required
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
        <Button type="button" className="w-full animate-appear">
          Sign in
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
