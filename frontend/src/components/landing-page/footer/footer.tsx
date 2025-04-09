import { Section } from "@/components/ui/section";
import Link from "next/link";

export function Footer() {
  return (
    <Section className="border-t border-border/10">
      <div className="mx-auto max-w-container py-6 flex flex-col gap-12 justify-between">
        <div className="grid grid-cols-6 gap-2 flex-grow">
          {/* Logo and tagline */}
          <div className="col-span-2">
            <div className="flex items-center text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 100 120"
              >
                <g transform="translate(10, 10) scale(0.08)">
                  <path
                    fill="currentColor"
                    d="M455 891c-206-95-215-418-16-536 39-23 51-36 51-55 1-48 11-70 35-70 12 0 28 7 35 14 6 8 33 29 59 45 40 26 58 31 108 31 78 0 142 23 195 69 124 109 132 323 17 441-69 71-100 80-284 80-135 0-166-3-200-19zm344-51c192-55 217-349 37-431-27-12-65-19-111-19-63 0-75-3-122-35l-52-35-3 28c-2 21-13 32-48 48-64 30-116 91-136 159-33 116 27 243 132 280 46 17 252 20 303 5z"
                  />
                  <path
                    fill="currentColor"
                    d="M630 720c-11-22-38-51-60-65-22-14-40-30-40-35s18-21 40-35c22-14 49-43 60-65 11-22 25-40 30-40s19 18 30 40c11 22 38 51 60 65 22 14 40 30 40 35s-18 21-40 35c-22 14-49 43-60 65-11 22-25 40-30 40s-19-18-30-40z"
                  />
                </g>
              </svg>
              <h1 className="text-xl font-semibold">selfAI.</h1>
            </div>
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
            <div className="flex items-center gap-6 rounded-3xl bg-white border border-border/50 bg-background p-4 w-[90%]">
              <div className="flex items-center text-indigo-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="60"
                  height="60"
                  viewBox="0 0 100 120"
                >
                  <g transform="translate(10, 10) scale(0.08)">
                    <path
                      fill="currentColor"
                      d="M455 891c-206-95-215-418-16-536 39-23 51-36 51-55 1-48 11-70 35-70 12 0 28 7 35 14 6 8 33 29 59 45 40 26 58 31 108 31 78 0 142 23 195 69 124 109 132 323 17 441-69 71-100 80-284 80-135 0-166-3-200-19zm344-51c192-55 217-349 37-431-27-12-65-19-111-19-63 0-75-3-122-35l-52-35-3 28c-2 21-13 32-48 48-64 30-116 91-136 159-33 116 27 243 132 280 46 17 252 20 303 5z"
                    />
                    <path
                      fill="currentColor"
                      d="M630 720c-11-22-38-51-60-65-22-14-40-30-40-35s18-21 40-35c22-14 49-43 60-65 11-22 25-40 30-40s19 18 30 40c11 22 38 51 60 65 22 14 40 30 40 35s-18 21-40 35c-22 14-49 43-60 65-11 22-25 40-30 40s-19-18-30-40z"
                    />
                  </g>
                </svg>
                <h1 className="text-xl font-semibold">selfAI.</h1>
              </div>

              <h3 className="font-bold text-2xl">Apply for early access</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              We are still fine tuning the product and would love your help.
              Join our Beta to help contribute
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Built remotely by students & dreamers 🌍
        </p>
      </div>
    </Section>
  );
}
