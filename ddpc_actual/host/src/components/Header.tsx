import React from 'react';
import { Link } from 'react-router-dom'; // <-- IMPORT Link

const Header = () => {
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      {/* --- CORRECTED LINK --- */}
      <Link to="/" className="text-2xl font-bold"> 
        DDPC
      </Link>
      <nav>
        <Link to="/garage" className="mx-2 hover:text-gray-400">Garage</Link>
        <Link to="/tools" className="mx-2 hover:text-gray-400">Tools</Link>
        <Link to="/profile" className="mx-2 hover:text-gray-400">Profile</Link>
      </nav>
    </header>
  );
};

export default Header;