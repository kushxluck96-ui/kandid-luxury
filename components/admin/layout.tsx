import Sidebar from "@/components/admin/Sidebar";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-neutral-100 min-h-screen">

      <Sidebar />

      <main className="flex-1">

        <header className="h-20 bg-white border-b flex items-center justify-end px-8">

          <LogoutButton />

        </header>

        <div className="p-10">

          {children}

        </div>

      </main>

    </div>
  );
}