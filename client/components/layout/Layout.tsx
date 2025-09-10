import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Layout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1 bg-grid-slate bg-[size:32px_32px]">
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 bg-radial-fade"></div>
          <div className="relative container mx-auto px-4 py-10 sm:py-14">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
