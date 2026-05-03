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
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      
      {/* Cinematic Top Header */}
      <header className="fixed top-0 z-[100] w-full border-b border-white/5 bg-black/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/40">
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-12">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all group-hover:scale-110">
              <Beaker className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <span className="font-black text-xl md:text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">HomeTester</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/search" className="text-sm font-bold text-cyan-400 hover:text-cyan-300">Database</Link>
            <Link to="/labs" className="text-sm font-medium text-slate-300 hover:text-white">Networks</Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                <Button variant="ghost" size="icon" onClick={logout} className="text-slate-400 hover:text-red-400 rounded-full">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm" className="rounded-full bg-white text-black font-bold px-6">Login</Button>
              </Link>
            )}
          </div>

          {/* Desktop Cart */}
          <Link to="/cart" className="hidden md:block">
            <Button variant="ghost" size="icon" className="relative rounded-full border border-white/10 hover:bg-white/10 text-slate-300">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-cyan-500 text-black text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center">{cartCount}</span>}
            </Button>
          </Link>
          
          {/* Mobile Profile Trigger (Simplified) */}
          <div className="md:hidden flex items-center gap-3">
            {isAuthenticated && (
              <Button variant="ghost" size="icon" onClick={logout} className="text-slate-500">
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-16 md:pt-20 pb-24 md:pb-0 relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile App Bottom Navigation */}
      <nav className="md:hidden mobile-bottom-nav">
        {navItems.map((item) => (
          <Link key={item.id} to={item.path} className="relative group px-2">
            <div className={`flex flex-col items-center gap-1 transition-all ${isActive(item.path) ? 'text-cyan-400 scale-110' : 'text-slate-500'}`}>
              <div className={`p-2 rounded-2xl transition-all ${isActive(item.path) ? 'bg-cyan-500/10' : ''}`}>
                <item.icon className="w-6 h-6" />
                {item.badge > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-black">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <footer className="hidden md:block border-t border-white/5 py-10 bg-black/40">
        <div className="container mx-auto px-6 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} HomeTester Platform • Cinematic Biotech Systems</p>
        </div>
      </footer>
    </div>
  );
}

