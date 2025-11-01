import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

import { Sidebar } from "./sidebar";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-white" />
      </SheetTrigger>
      <SheetContent
        className="p-0 z-[100] bg-background border-r border-border"
        side="left"
      >
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
