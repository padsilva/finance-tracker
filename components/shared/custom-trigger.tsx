"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export const CustomTrigger = () => {
  const isMobile = useIsMobile();

  return isMobile ? <SidebarTrigger /> : null;
};
