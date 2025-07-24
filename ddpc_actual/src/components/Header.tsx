
import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-md z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">MyDDPC</h1>
        <nav>
          <a href="#" className="px-4 hover:text-gray-300">Garage</a>
          <a href="#" className="px-4 hover:text-gray-300">Tools</a>
          <a href="#" className="px-4 hover:text-gray-300">Profile</a>
        </nav>
      </div>
    </header>
  );
};

export default Header; 