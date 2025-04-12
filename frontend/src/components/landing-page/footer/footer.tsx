import { Section } from "@/components/ui/section";
import { Logo } from "@/components/logo/Logo";
import Link from "next/link";

export function Footer() {
  return (
    <Section className="border-t border-border/10 bg-white ">
      <div className="mx-auto max-w-container flex flex-col gap-12 justify-between mt-36">
        <div className="grid grid-cols-6 gap-2 flex-grow">
          {/* Logo and tagline */}
          <div className="col-span-2">
            <Logo />
            <p className="mt-2 text-sm text-muted-foreground">
              Experience the future of personal branding.
            </p>
          </div>

          {/* About */}
          <div className="col-span-1 ml-10">
            <h3 className="font-medium">About</h3>
            <div className="mt-4 flex flex-col space-y-3 text-sm text-muted-foreground">
              <Link href="/how-it-works">How It Works</Link>
              <Link href="/about">Our Story</Link>
            </div>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h3 className="font-medium">Company</h3>
            <div className="mt-4 flex flex-col space-y-3 text-sm text-muted-foreground">
              <Link href="/press">Blog</Link>
              <Link href="/terms">Terms of service</Link>
              <Link href="/privacy">Privacy Policy</Link>
            </div>
          </div>

          {/* Early access */}
          <div className="col-span-2 flex flex-col gap-6">
            <div className="flex items-center gap-6 rounded-3xl bg-indigo-50 border border-border/50 bg-background p-4 w-[90%]">
              <Logo />

              <h3 className="font-bold text-2xl text-indigo-600">
                Apply for early access
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              We are still fine tuning the product and would love your help.
              Join our Beta to help contribute
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Built remotely by a student & a dreamer 🌍
        </p>
      </div>
    </Section>
  );
}
