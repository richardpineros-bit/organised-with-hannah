import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard, FileText, Calendar, ShoppingBag, MessageSquare,
  Image, Settings, LogOut, Menu, X, Users, HelpCircle
} from 'lucide-react';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/content', label: 'Content Editor', icon: FileText },
  { path: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { path: '/admin/services', label: 'Services', icon: ShoppingBag },
  { path: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { path: '/admin/gallery', label: 'Gallery', icon: Image },
  { path: '/admin/quiz', label: 'Quiz Builder', icon: HelpCircle },
  { path: '/admin/contacts', label: 'Contacts', icon: Users },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      useAuthStore.getState().checkAuth().then(() => {
        const state = useAuthStore.getState();
        if (!state.isAuthenticated) {
          navigate('/admin/login');
        } else if (!state.isAdmin) {
          navigate('/');
        }
      });
    }
  }, [user, navigate]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-primary">Admin Panel</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r transition-transform duration-200`}
        >
          <div className="p-6 border-b">
            <div className="text-lg font-bold text-primary">Organised With Hannah</div>
            <div className="text-xs text-gray-500">Admin Panel</div>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <div className="text-sm text-gray-600 mb-2">{user?.name || user?.email}</div>
            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="flex items-center text-sm text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
