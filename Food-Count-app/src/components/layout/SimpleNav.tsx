// This is a simple navabr when the user is not logged in
import { Link, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';

const SimpleNav = () => {
  const location = useLocation();
  
  return (
    <header className="bg-white shadow-sm py-3 px-4 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity duration-150">
            <img className="w-6 h-6 text-green-500" src='/foodconnect_logo.png'/>
            <span className="ml-2 text-xl font-semibold text-black ">FoodConnect</span>
            </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className={`text-black hover:text-gray-700 font-medium ${
              location.pathname === '/login' ? 'text-green-600' : ''
            }`}
          >
            Sign In
          </Link>
          <Link 
            to="/signup" 
            className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors ${
              location.pathname === '/signup' ? 'bg-green-600' : ''
            }`}
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SimpleNav;
