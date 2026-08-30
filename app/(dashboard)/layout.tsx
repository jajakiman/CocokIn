import type { ReactNode } from "react";
import { getSession } from "@/src/lib/session";
import { AppShell } from "@/src/design-system/app-shell";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getSession();

  // Determine the role for the navbar. Default to TALENT if not authenticated in this context,
  // though the individual pages will handle actual auth redirection.
  const role = session?.role === "BUSINESS" ? "business" : 
               session?.role === "ADMIN" ? "admin" : "talent";

  return (
    <AppShell role={role}>
      {children}
    </AppShell>
  );
}
