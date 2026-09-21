import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { LayoutDashboard, UtensilsCrossed, FolderTree, Settings, LogOut, Menu, X } from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/items', label: 'Menu Items', icon: UtensilsCrossed },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate('/admin/login');
  }

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-charcoal-900 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-charcoal-800/95 backdrop-blur-sm border-b border-charcoal-700/40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden text-cream-100/60 hover:text-cream-50"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <Link to="/admin" className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">
                  <span className="text-avocado-400">Health</span>{' '}
                  <span className="text-cream-100">Fuel</span>
                </span>
                <span className="text-cream-100/30 text-2xs font-semibold tracking-wider uppercase">Admin</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/menu" className="text-cream-100/40 hover:text-avocado-400 text-xs font-medium transition-colors hidden sm:block">
                View Menu
              </Link>
              <span className="text-cream-100/30 text-xs hidden sm:block">·</span>
              <span className="text-cream-100/50 text-xs font-medium hidden sm:block">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="text-cream-100/40 hover:text-red-400 transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`${mobileOpen ? 'block' : 'hidden'} lg:block fixed lg:sticky top-14 left-0 z-30 w-56 h-[calc(100vh-3.5rem)] bg-charcoal-800/50 border-r border-charcoal-700/30 overflow-y-auto`}>
          <nav className="p-3 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to, item.exact);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-avocado-500/15 text-avocado-300'
                      : 'text-cream-100/50 hover:text-cream-50 hover:bg-charcoal-700/30'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="lg:hidden fixed inset-0 top-14 bg-black/40 z-20"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
