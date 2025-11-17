import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LayoutDashboard, TrendingUp, Bot, History, LogOut } from 'lucide-react'

const Layout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navItems = [
    { path: '/', label: '대시보드', icon: LayoutDashboard },
    { path: '/trade', label: '거래', icon: TrendingUp },
    { path: '/strategy', label: '자동매매', icon: Bot },
    { path: '/history', label: '히스토리', icon: History }
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-400">Bitget Trading</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-300">{user?.username}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
              >
                <LogOut size={18} />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-4 border-b-2 transition ${
                    isActive
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
