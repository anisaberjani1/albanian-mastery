import { cn } from "@/lib/utils";
import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SidebarItem } from "./sidebar-item";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "flex h-full lg:w-[265px] lg:fixed left-0 top-0 px-4 flex-col bg-section border-1 border-border shadow-sm",
        className
      )}
    >
      <Link href="/">
        <div className="pb-4 flex items-center gap-x-3">
          <Image src="/logo1.png" height={80} width={220} alt="albanian mastery" />
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem label="Learn" href="/learn" iconSrc="/learn.png" />
        <SidebarItem
          label="Leaderboard"
          href="/leaderboard"
          iconSrc="/leaderboard.png"
        />
        <SidebarItem label="Quests" href="/quests" iconSrc="/quests.png" />
        <SidebarItem label="Shop" href="/shop" iconSrc="/shop.png" />
      </div>
      <div className="p-4">
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton/>
        </ClerkLoaded>
      </div>
    </div>
  );
};
