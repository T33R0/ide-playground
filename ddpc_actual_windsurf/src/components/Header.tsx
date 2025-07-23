import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  // Helper function to determine if a nav item is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-blue-600 text-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">DD</span>
            </div>
            <span className="text-xl font-bold">MyDDPC</span>
          </Link>

          {/* Navigation */}
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link 
                  to="/garage" 
                  className={`${isActive('/garage') ? 'text-blue-200' : 'hover:text-blue-200 transition-colors duration-200'}`}
                >
                  Garage
                </Link>
              </li>
              <li>
                <Link 
                  to="/tools" 
                  className="hover:text-blue-200 transition-colors duration-200"
                >
                  Tools
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="hover:text-blue-200 transition-colors duration-200"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </nav>

          {/* User/Auth section - placeholder */}
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-sm">👤</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
