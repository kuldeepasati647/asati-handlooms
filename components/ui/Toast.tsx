
import React from 'react';
import { useApp } from '../../context/AppContext';

const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const bgColor = toast.type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = toast.type === 'success' ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div className={`fixed bottom-5 right-5 ${bgColor} text-white py-3 px-6 rounded-lg shadow-2xl flex items-center space-x-3 z-50 animate-fade-in`}>
      {icon}
      <span>{toast.message}</span>
    </div>
  );
};

export default Toast;
