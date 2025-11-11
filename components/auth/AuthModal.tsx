import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

interface AuthModalProps {
  isVisible: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ isVisible }) => {
  const { setShowAuthModal, login } = useApp();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Delay to allow for mount animation
      const timer = setTimeout(() => setShowContent(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId && password) {
      login(userId, password);
      // Reset fields
      setUserId('');
      setPassword('');
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAuthModal(false)}>
      <div 
        className={`bg-ivory rounded-xl shadow-2xl p-10 w-full max-w-md relative transition-all duration-500 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-indigo-light hover:text-indigo">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
           </svg>
        </button>
        <h2 className="text-3xl font-serif font-bold text-center text-indigo mb-6">Welcome Back</h2>
        <p className="text-center text-indigo-light mb-6 -mt-4 text-sm">(Admin: admin/admin or use generated user ID)</p>
        <form onSubmit={handleSubmit} className="space-y-6 overflow-hidden">
          <div className={`${showContent ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <label className="block text-sm font-medium text-indigo-light mb-1">User ID</label>
            <input 
              type="text" 
              value={userId} 
              onChange={(e) => setUserId(e.target.value)} 
              className="w-full px-4 py-3 bg-beige border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo" 
              required 
            />
          </div>
          <div className={`${showContent ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '100ms'}}>
            <label className="block text-sm font-medium text-indigo-light mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 bg-beige border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo" 
              required 
            />
          </div>
          <div className={`${showContent ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '300ms'}}>
            <button 
              type="submit" 
              className="w-full bg-indigo text-ivory font-bold py-3 px-4 rounded-lg hover:bg-indigo-light transition-colors duration-300 transform hover:scale-105"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
