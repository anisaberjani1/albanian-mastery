"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  label: string;
  iconSrc: string;
  href: string;
};

export const SidebarItem = ({ label, iconSrc, href }: Props) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Button
      className={cn(
        "justify-start h-[52px] w-full text-foreground font-medium tracking-wide transition-all",
        active
          ? "bg-primary/5 text-primary border-l-4 border-primary"
          : "hover:bg-primary/5 hover:text-primary"
      )}
      asChild
    >
      <Link href={href} className="flex items-center w-full">
        <Image
          src={iconSrc}
          alt={label}
          className="mr-4"
          height={36}
          width={36}
        />
        <span>{label}</span>
      </Link>
    </Button>
  );
};
