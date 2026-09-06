import type { ReactNode } from "react";
import { getSession } from "@/src/lib/session";
import { AppShell } from "@/src/design-system/app-shell";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import { GlobalNotification } from "@/src/components/ui/global-notification";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getSession();
  if (!session) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.id }, select: { emailVerified: true } });
  if (!user?.emailVerified) redirect("/verify-email");

  // Determine the role for the navbar. Default to TALENT if not authenticated in this context,
  // though the individual pages will handle actual auth redirection.
  const role = session.role === "BUSINESS" ? "business" :
               session.role === "ADMIN" ? "admin" : "talent";

  return (
    <AppShell role={role} user={session}>
      <GlobalNotification userId={session.id} />
      {children}
    </AppShell>
  );
}

