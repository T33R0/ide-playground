import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <div className="mb-4 md:mb-0">
            <p>© {new Date().getFullYear()} MyDDPC. All rights reserved.</p>
          </div>

          {/* Footer Links */}
          <div className="flex space-x-6">
            <Link 
              to="/contact" 
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Contact
            </Link>
            <Link 
              to="/terms" 
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link 
              to="/privacy" 
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Social Links - Placeholder */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Twitter</span>
              <span className="text-xl">𝕏</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">GitHub</span>
              <span className="text-xl">⎘</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
