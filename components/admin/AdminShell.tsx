import AdminTopbar from "./AdminTopbar";
import AdminSidebar from "./AdminSidebar";

type Props = {
  title?: string;
  description?: string;
  children: React.ReactNode;
};

export default function AdminShell({ title, description, children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50/60">
      <AdminSidebar />

      <div className="lg:pl-64">
        <AdminTopbar />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            {(title || description) && (
              <div className="mb-5">
                {title && (
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-1 text-sm text-gray-500">{description}</p>
                )}
              </div>
            )}

            <section className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/70">
              <div className="p-4 sm:p-6">{children}</div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
