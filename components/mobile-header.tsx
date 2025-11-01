import { MobileSidebar } from "./mobile-sidebar";

export const MobileHeader = () => {
  return (
    <nav className="lg:hidden px-6 h-[50px] flex items-center bg-primary text-primary-foreground border-b border-border fixed top-0 w-full z-50 shadow-sm">
      <MobileSidebar/>
    </nav>
  );
};
