
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-beige text-indigo-light py-8">
      <div className="container mx-auto px-6 text-center">
        <p className="font-serif text-xl mb-2">Asati Handloom</p>
        <p className="text-sm">&copy; {new Date().getFullYear()} Asati Handloom. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" className="hover:text-indigo transition-colors">Instagram</a>
          <a href="#" className="hover:text-indigo transition-colors">Facebook</a>
          <a href="#" className="hover:text-indigo transition-colors">Pinterest</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
