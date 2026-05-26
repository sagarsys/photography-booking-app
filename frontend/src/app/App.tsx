import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { AdminBookingsPage } from '../features/admin-bookings/page/AdminBookingsPage'
import { AdminCustomersPage } from '../features/admin-customers/page/AdminCustomersPage'
import { AdminPackagesPage } from '../features/admin-packages/page/AdminPackagesPage'
import { PublicBookingPage } from '../features/public-booking/page/PublicBookingPage'
import { cn } from '../shared/lib/cn'
import { navigationItems } from './navigation'

export default function App() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-white/10 bg-black/20 p-4 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-300">
                SagaVortex Demo
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-white">
                Photography booking frontend
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                Public booking flow on one side, demo-friendly admin tools on the other. All
                actions map directly to the existing Spring Boot endpoints.
              </p>
            </div>

            <nav className="flex flex-wrap gap-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition',
                      isActive
                        ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20'
                        : 'bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white',
                    )
                  }
                  end={item.end}
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="py-8">
          <Routes>
            <Route element={<PublicBookingPage />} path="/" />
            <Route element={<AdminBookingsPage />} path="/admin/bookings" />
            <Route element={<AdminPackagesPage />} path="/admin/packages" />
            <Route element={<AdminCustomersPage />} path="/admin/customers" />
            <Route element={<Navigate replace to="/" />} path="*" />
          </Routes>
        </main>
      </div>
    </div>
  )
}
