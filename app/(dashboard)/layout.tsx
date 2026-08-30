import type { ReactNode } from "react";
import { getSession } from "@/src/lib/session";
import { DashboardNavbar } from "@/src/components/dashboard/dashboard-navbar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getSession();

  // Determine the role for the navbar. Default to TALENT if not authenticated in this context,
  // though the individual pages will handle actual auth redirection.
  const role = session?.role === "BUSINESS" ? "BUSINESS" : 
               session?.role === "ADMIN" ? "ADMIN" : "TALENT";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <DashboardNavbar role={role} />
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
