import { GitHubLogoIcon } from '@radix-ui/react-icons';
import React from 'react';

const Footer = () => {
  return (
    <footer className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
      <div className="text-sm text-gray-600">
        Coded by Sai Teja
      </div>
      <div className="mt-4 sm:mt-0">
        <a 
          href="https://github.com/saiteja-in" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <GitHubLogoIcon className="w-5 h-5 mr-2" />
          <span>GitHub</span>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
