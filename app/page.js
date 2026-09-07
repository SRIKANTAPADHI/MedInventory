
import Link from "next/link";
import {
  LayoutDashboard,
  Pill,
  Package,
  ShoppingCart,
  BarChart3,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "Dashboard",
      description: "View your complete inventory overview.",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Medicines",
      description: "Add, update and manage medicines.",
      href: "/medicines",
      icon: Pill,
    },
    {
      title: "Inventory",
      description: "Track stock levels and availability.",
      href: "/inventory",
      icon: Package,
    },
    {
      title: "Sales",
      description: "Manage medicine sales and transactions.",
      href: "/sales",
      icon: ShoppingCart,
    },
    {
      title: "Reports",
      description: "Analyze inventory and sales reports.",
      href: "/reports",
      icon: BarChart3,
    },
  ];

  return (
    <main className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

      {/* Hero */}

      <section className="mx-auto max-w-7xl px-6 py-20 text-center">

        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm">
          <ShieldCheck size={17} />
          Secure Medicine Management
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Smart{" "}
          <span className="text-blue-600">
            Medicine Inventory
          </span>{" "}
          Management
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Manage medicines, track stock, monitor sales and
          generate reports — all from one simple platform.
        </p>

        {/* Buttons */}

        <div className="mt-8 flex justify-center gap-4">

          <Link
            href="/dashboard"
            className="group flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
          >
            Open Dashboard

            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/medicines"
            className="rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-semibold text-gray-700 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:text-blue-600"
          >
            View Medicines
          </Link>

        </div>

      </section>


      {/* Features */}

      <section className="mx-auto max-w-7xl px-6 pb-20">

        <div className="mb-8 text-center">

          <h2 className="text-2xl font-bold text-gray-900">
            Manage Everything in One Place
          </h2>

          <p className="mt-2 text-gray-500">
            Quick access to all important features.
          </p>

        </div>


        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="group rounded-2xl border border-white bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={23} />
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {feature.description}
                </p>

                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600">
                  Open
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>

              </Link>
            );
          })}

        </div>

      </section>


      {/* Footer */}

      <footer className="border-t border-gray-200 bg-white/70 py-5 text-center">

        <p className="text-sm text-gray-500">
          © 2026 MedInventory · Medicine Inventory Management System
        </p>

      </footer>

    </main>
  );
}

