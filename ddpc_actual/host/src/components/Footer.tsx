
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-400 p-4 mt-8 border-t border-neutral-700">
      <div className="container mx-auto text-center">
        <Link to="/contact" className="px-4 hover:text-primary-light transition-colors duration-300">Contact</Link>
        <Link to="/terms" className="px-4 hover:text-primary-light transition-colors duration-300">Terms of Service</Link>
      </div>
    </footer>
  );
};

export default Footer; 