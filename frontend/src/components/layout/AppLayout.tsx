import { Outlet } from "react-router-dom";

import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";

/**
 * App shell: desktop sidebar, top header, scrollable content and mobile nav.
 * Pages render inside the <Outlet />.
 */
export function AppLayout() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <Sidebar />

      <div className="lg:pl-64">
        <Header />
        <main className="px-4 pb-24 pt-6 lg:px-8 lg:pb-10">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
