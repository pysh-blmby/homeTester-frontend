import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import { Button } from '../ui/button';
import { Beaker, User, LogOut, ShoppingCart, Search, Activity, Home, Briefcase, Shield } from 'lucide-react';

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const cartCount = useCartStore(state => state.items.length);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { id: 'home', path: '/', icon: Home, label: 'Home' },
    { id: 'search', path: '/search', icon: Search, label: 'Explore' },
    { id: 'cart', path: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartCount },
    { id: 'dashboard', path: '/dashboard', icon: User, label: 'Hub' },
  ];

  if (user?.role === 'lab_owner') {
    navItems.splice(3, 0, { id: 'lab', path: '/lab-dashboard', icon: Briefcase, label: 'Console' });
  } else if (user?.role === 'super_admin') {
    navItems.splice(3, 0, { id: 'admin', path: '/admin', icon: Shield, label: 'Ops' });
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-blue-500/30">
      
      {/* Clean Medical Header */}
      <header className="glass-nav">
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 transition-all group-hover:scale-105">
              <Beaker className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl md:text-2xl tracking-tight text-slate-900">HomeTester</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6 text-sm font-semibold text-slate-600">
              <Link to="/search" className="hover:text-blue-600 transition-colors">Find Tests</Link>
              <Link to="/labs" className="hover:text-blue-600 transition-colors">Our Labs</Link>
            </nav>
            
            <div className="flex items-center gap-4 border-l border-slate-200 pl-8">
              <Link to="/cart" className="relative group">
                <div className="p-2 rounded-full hover:bg-slate-100 transition-all text-slate-600">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm" className="rounded-full border-slate-200 hover:bg-slate-50">
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={logout} className="text-slate-400 hover:text-red-600 rounded-full">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 h-10 shadow-lg shadow-blue-600/10">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile Profile Trigger (Simplified) */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-slate-600" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-[#f8fafc]">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 md:pb-0 relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile App Bottom Navigation */}
      <nav className="md:hidden mobile-bottom-nav shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        {navItems.map((item) => (
          <Link key={item.id} to={item.path} className="relative px-2">
            <div className={`flex flex-col items-center gap-1.5 transition-all ${isActive(item.path) ? 'text-blue-600' : 'text-slate-400'}`}>
              <div className={`transition-all ${isActive(item.path) ? 'scale-110' : ''}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
              {isActive(item.path) && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-2 w-1 h-1 bg-blue-600 rounded-full"
                />
              )}
            </div>
          </Link>
        ))}
      </nav>

      <footer className="hidden md:block bg-white border-t border-slate-100 py-12 mt-auto">
        <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <Beaker className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-lg text-slate-900">HomeTester</span>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} HomeTester Health Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link to="/search" className="hover:text-blue-600">Tests</Link>
            <Link to="/labs" className="hover:text-blue-600">Labs</Link>
            <Link to="/partner" className="hover:text-blue-600">For Labs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

