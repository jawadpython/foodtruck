// This layout is only for admin dashboard pages, not the login page
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Just return children for now - the dashboard layout will handle auth
  return <>{children}</>;
}
