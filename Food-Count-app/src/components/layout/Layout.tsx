import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import SimpleNav from './SimpleNav';
import useAuthStore from '../../store/authStore';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../shared/LoadingSpinner';

const Layout = () => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only set loading to false after initial auth check is complete
    if (!isCheckingAuth) {
      setIsLoading(false);
    }
  }, [isCheckingAuth]);

  // Show loading spinner while checking auth state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated ? <Navigation /> : <SimpleNav />}
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="ml-2 font-medium hover:text-green-500">FoodConnect</span>
              </div>
              <p className="text-sm text-gray-400">Making a difference, one meal at a time.</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/#how-it-works" className="hover:text-green-500">How It Works</Link></li>
                <li><Link to="/#partners" className="hover:text-green-500">Partners</Link></li>
                <li><Link to="/#impact" className="hover:text-green-500">Impact</Link></li>
                <li><Link to="/#testimonials" className="hover:text-green-500">Testimonials</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/blog" className="hover:text-green-500">Blog</Link></li>
                <li><Link to="/faq" className="hover:text-green-500">FAQ</Link></li>
                <li><Link to="/support" className="hover:text-green-500">Support</Link></li>
                <li><Link to="/contact" className="hover:text-green-500">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/privacy" className="hover:text-green-500">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-green-500">Terms of Service</Link></li>
                <li><Link to="/cookies" className="hover:text-green-500">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-400 text-center">
            © 2025 FoodConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;