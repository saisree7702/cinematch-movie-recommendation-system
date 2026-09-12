import { Film, Github, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-cin-border bg-cin-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cin-gold to-cin-rose flex items-center justify-center">
                <Film className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold text-lg text-white">
                Cine<span className="text-gradient">Match</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Discover Movies You'll Love. Personalized recommendations based on your taste, mood, and preferences.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-cin-gold transition">Home</Link></li>
              <li><Link to="/discover" className="text-gray-400 hover:text-cin-gold transition">Discover Movies</Link></li>
              <li><Link to="/recommendations" className="text-gray-400 hover:text-cin-gold transition">My Recommendations</Link></li>
              <li><Link to="/favorites" className="text-gray-400 hover:text-cin-gold transition">Favorites</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-cin-gold transition">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-cin-gold transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-cin-gold transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-cin-border text-center text-sm text-gray-500">
          © {new Date().getFullYear()} CineMatch. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
