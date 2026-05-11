import { Sidebar, readInitialSidebarCollapsed } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  const isMd = useMediaQuery("(min-width: 768px)");
  const [collapsed, setCollapsed] = useState(() => readInitialSidebarCollapsed());
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-dvh bg-background">
      {isMd ? (
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
      ) : (
        <>
          <div
            className={cn(
              "fixed inset-0 z-40 bg-foreground/40 transition md:hidden",
              mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            aria-hidden={!mobileOpen}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] transition md:hidden",
              mobileOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <Sidebar
              collapsed={false}
              onToggleCollapse={() => {}}
              onNavigate={() => setMobileOpen(false)}
              className="shadow-xl"
            />
          </div>
        </>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
