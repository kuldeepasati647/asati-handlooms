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
    const typingSpeed = 100;

    const timeouts: Array<ReturnType<typeof setTimeout>> = [];

    for (let i = 0; i <= text.length; i++) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(text.slice(0, i));

        if (i === text.length) {
          setTypingComplete(true);
        }
      }, i * typingSpeed);

      timeouts.push(timeoutId);
    }

    const typingDuration = text.length * typingSpeed;
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, typingDuration + 1000);

    const loadTimer = setTimeout(() => {
      onLoaded();
    }, typingDuration + 1500);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(fadeOutTimer);
      clearTimeout(loadTimer);
    };
  }, [onLoaded, text]);

  return (
    <div
      className={`fixed inset-0 bg-ivory z-[100] flex items-center justify-center transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
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
