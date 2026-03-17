import Link from "next/link";
import { cn } from "@/lib/utils/utils";

interface LogoProps {
  withText?: boolean;
  compact?: boolean;
  size?: number;
  href?: string;
  className?: string;
}

export function Logo({
  withText = true,
  compact = false,
  size = 60,
  href = "/",
  className,
}: LogoProps) {
  return (
    <Link
      href={href}
      className={cn("flex items-center group", className)}
      aria-label="Go to SelfAI Home"
    >
      {withText && (
        <span className="text-xl font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors">
          {compact ? "selfAI" : "selfAI"}
        </span>
      )}
    </Link>
  );
}
