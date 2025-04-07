import { Link } from 'react-router-dom';
import { Bell, LogOut, Heart, Search } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Navigation = () => {
  const { logout, user } = useAuthStore();
  
  // Determine dashboard path based on account type
  const dashboardPath = user?.accountType === 'donor' ? '/donor/dashboard' : '/recipient/dashboard';
  
  return (
    <header className="bg-white shadow-sm py-3 px-4 fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to={dashboardPath} className="flex items-center hover:opacity-80 transition-opacity duration-150">
            <img className="w-6 h-6 text-green-500" src='/foodconnect_logo.png'/>
            <span className="ml-2 text-xl font-semibold text-black ">FoodConnect</span>
          </Link>
        </div>
        
        <div className="flex-1 max-w-2xl mx-8 hidden md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type="search" 
              className="block w-full p-2 pl-10 pr-4 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500" 
              placeholder="Search for available food..." 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Link to="/notifications" className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                1
              </span>
              <Bell className="w-6 h-6" />
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <img 
              src={user?.avatarUrl || "https://via.placeholder.com/150?text=User"} 
              alt={user?.name || "User"} 
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/150?text=User";
              }}
            />
            <span className="text-sm font-medium hidden md:block">{user?.name || "User"}</span>
          </div>
          
          <button 
            onClick={logout}
            className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 hidden md:block"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;