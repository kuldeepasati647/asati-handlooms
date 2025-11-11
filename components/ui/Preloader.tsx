import React, { useState, useEffect } from 'react';

interface PreloaderProps {
  onLoaded: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onLoaded }) => {
  const text = "Welcome to Asati Handloom";
  const [displayedText, setDisplayedText] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        setTypingComplete(true);
      }
    }, 100);

    // Typing takes ~2.6s. Wait a moment, then fade.
    const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);
    }, 3500); 

    // Fade duration is 500ms. Call onLoaded after it finishes.
    const loadTimer = setTimeout(() => {
        onLoaded();
    }, 4000);

    return () => {
        clearInterval(typingInterval);
        clearTimeout(fadeOutTimer);
        clearTimeout(loadTimer);
    }
  }, [onLoaded]);

  return (
    <div className={`fixed inset-0 bg-ivory z-[100] flex items-center justify-center transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      <h1 className="text-4xl md:text-5xl font-serif text-indigo text-center p-4">
        {displayedText}
        {!typingComplete && (
            <span className="inline-block w-1 h-10 ml-1 bg-indigo animate-pulse"></span>
        )}
      </h1>
    </div>
  );
};

export default Preloader;
