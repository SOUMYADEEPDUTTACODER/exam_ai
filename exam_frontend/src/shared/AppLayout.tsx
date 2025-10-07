import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

const NavItem: React.FC<{ to: string; label: string }> = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-md text-sm font-medium ${
        isActive ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
      }`
    }
  >
    {label}
  </NavLink>
)

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="font-semibold text-primary-700">ExamPrep</Link>
          <nav className="flex gap-2">
            <NavItem to="/syllabus" label="Syllabus" />
            <NavItem to="/study" label="Study" />
            <NavItem to="/questions" label="Questions" />
            <NavItem to="/mock" label="Mock" />
            <NavItem to="/progress" label="Progress" />
          </nav>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <Outlet />
      </main>

      <footer className="border-t py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ExamPrep. All rights reserved.
      </footer>
    </div>
  )
}

export default AppLayout


