
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-neutral-900 text-white p-4 shadow-md z-10 border-b border-neutral-700">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <h1 className="text-xl font-bold text-primary-light">MyDDPC</h1>
        </Link>
        <nav>
          <Link to="/garage" className="px-4 hover:text-primary-light transition-colors duration-300">Garage</Link>
          <Link to="/tools" className="px-4 hover:text-primary-light transition-colors duration-300">Tools</Link>
          <Link to="/profile" className="px-4 hover:text-primary-light transition-colors duration-300">Profile</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 