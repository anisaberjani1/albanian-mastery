"use client";

import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="w-full max-w-[1280px] mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12 px-6 py-20">
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-8 max-w-[520px]">
        <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-[var(--heading)]">
          Learn smarter, not harder.
        </h1>

        <p className="text-lg leading-relaxed text-[var(--paragraph)]">
          Experience personalized Albanian language learning powered by adaptive
          AI challenges and real-time feedback.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm">
          <ClerkLoading>
            <Loader className="h-5 w-5 text-[var(--muted-foreground)] animate-spin" />
          </ClerkLoading>

          <ClerkLoaded>
            <SignedOut>
              <SignUpButton mode="modal" fallbackRedirectUrl="/learn">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto"
                >
                  Get Started
                </Button>
              </SignUpButton>

              <SignInButton mode="modal" fallbackRedirectUrl="/learn">
                <Button
                  size="lg"
                  variant="primaryOutline"
                  className="w-full sm:w-auto"
                >
                  I already have an account
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
                asChild
              >
                <Link href="/learn">Continue Learning</Link>
              </Button>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </div>

      <div className="relative w-[280px] h-[280px] lg:w-[540px] lg:h-[420px] rounded-4xl">
        <Image
          src="/hero2.png"
          fill
          alt="Hero illustration"
          className="object-contain drop-shadow-[0_8px_25px_rgba(17,70,143,0.2)]"
        />
      </div>
    </section>
  );
};
