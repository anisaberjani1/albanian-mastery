"use client";

import { Button } from "@/components/ui/button";
import { adminIds } from "@/constants";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Link from "next/link";

export const Header = () => {
  const { userId} = useAuth();
  const isAdmin = userId && adminIds.includes(userId);

  return (
    <header className="w-full h-20 bg-white border-b border-[var(--border)] shadow-sm">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between h-full px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-extrabold text-[var(--foreground)] tracking-wide">
            Albanian
          </span>
          <span className="text-2xl font-extrabold text-[var(--secondary)] tracking-wide">
            Mastery
          </span>
        </Link>

        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>

        <ClerkLoaded>
          <SignedIn>
            <div className="flex items-center gap-3">
            {isAdmin && (
              <Link href="/admin">
                <Button
                    size="sm"
                    variant="secondary"
                    className="text-white border-[var(--primary)] hover:bg-[var(--primary-hover)] hover:text-[var(--secondary)]"
                  >
                    Dashboard
                  </Button>
              </Link>
            )}
            <UserButton
            />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-3">
              <SignInButton mode="modal" fallbackRedirectUrl="/learn">
                <Button
                  size="sm"
                  variant="primary"
                  className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white hover:text-[var(--primary)] px-8 py-6"
                >
                  Login
                </Button>
              </SignInButton>
            </div>
          </SignedOut>
        </ClerkLoaded>
      </div>
    </header>
  );
};
