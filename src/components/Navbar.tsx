import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Menu, X, User, LogOut, Heart, Sparkles, Compass, Home as HomeIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast('Signed out successfully', 'success');
      navigate('/');
    } catch {
      showToast('Failed to sign out', 'error');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/discover', label: 'Discover Movies', icon: Compass },
  ];

  const authedLinks = [
    { to: '/recommendations', label: 'My Recommendations', icon: Sparkles },
    { to: '/favorites', label: 'Favorites', icon: Heart },
  ];

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, label, icon: Icon }: { to: string; label: string; icon: typeof Film }) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive(to)
          ? 'text-cin-gold bg-cin-gold/10'
          : 'text-gray-300 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-cin-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cin-gold to-cin-rose flex items-center justify-center transition-transform group-hover:scale-110">
              <Film className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              Cine<span className="text-gradient">Match</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink key={l.to} {...l} />
            ))}
            {user && authedLinks.map((l) => <NavLink key={l.to} {...l} />)}
          </div>

          {/* Desktop auth */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm font-medium text-gray-200 hover:text-white transition"
                >
                  <User className="w-4 h-4" />
                  {profile?.full_name || 'Profile'}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-200 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-cin-gold to-cin-rose text-black text-sm font-bold hover:opacity-90 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-white"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden glass border-t border-cin-border animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((l) => (
              <NavLink key={l.to} {...l} />
            ))}
            {user && authedLinks.map((l) => <NavLink key={l.to} {...l} />)}
            <div className="pt-3 border-t border-cin-border space-y-1">
              {user ? (
                <>
                  <NavLink to="/profile" label="Profile" icon={User} />
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-200 hover:text-white hover:bg-white/5 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 rounded-lg bg-gradient-to-r from-cin-gold to-cin-rose text-black text-sm font-bold text-center transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
