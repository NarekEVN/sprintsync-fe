import { Link, NavLink, Outlet } from 'react-router-dom'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export function AppLayout() {
  const [open, setOpen] = useState(false)

  const navItemStyles = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="sm:hidden" aria-label="Open menu" onClick={() => setOpen((v) => !v)}>
                <Bars3Icon className="h-6 w-6" />
              </button>
              <Link to="/" className="text-lg font-semibold">SprintSync</Link>
            </div>
            <nav className="hidden sm:flex gap-1">
              <NavLink to="/" className={navItemStyles} end>
                Dashboard
              </NavLink>
              <NavLink to="/tasks" className={navItemStyles}>
                Tasks
              </NavLink>
              <NavLink to="/admin" className={navItemStyles}>
                Admin
              </NavLink>
            </nav>
          </div>
        </div>
        {open && (
          <div className="sm:hidden border-t">
            <div className="px-2 py-2 space-y-1">
              <NavLink to="/" className={navItemStyles} end onClick={() => setOpen(false)}>
                Dashboard
              </NavLink>
              <NavLink to="/tasks" className={navItemStyles} onClick={() => setOpen(false)}>
                Tasks
              </NavLink>
              <NavLink to="/admin" className={navItemStyles} onClick={() => setOpen(false)}>
                Admin
              </NavLink>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

      <footer className="border-t p-4 text-center text-sm text-gray-500">© {new Date().getFullYear()} SprintSync</footer>
    </div>
  )
}
