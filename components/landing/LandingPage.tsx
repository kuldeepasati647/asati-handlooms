
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const ParallaxSVG: React.FC<{ scrollY: number }> = ({ scrollY }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute w-full h-full text-beige transition-transform duration-500 ease-out"
        style={{ transform: `translateY(${scrollY * 0.1}px)`, top: '-20%' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path d="M0,50 Q25,20 50,50 T100,50" stroke="currentColor" fill="none" strokeWidth="1" opacity="0.3" />
        <path d="M0,60 Q25,90 50,60 T100,60" stroke="currentColor" fill="none" strokeWidth="1" opacity="0.2" />
      </svg>
      <svg
        className="absolute w-full h-full text-indigo-light transition-transform duration-500 ease-out"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <circle cx="80" cy="20" r="10" stroke="currentColor" fill="none" strokeWidth="0.5" opacity="0.4" />
        <path d="M10,10 L30,30 M40,20 L20,40" stroke="currentColor" fill="none" strokeWidth="0.5" opacity="0.3" />
      </svg>
      <svg
        className="absolute w-full h-full text-indigo transition-transform duration-500 ease-out"
        style={{ transform: `translateY(${scrollY * 0.5}px)`, top: '30%' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path d="M0,70 C30,50 70,90 100,70" stroke="currentColor" fill="none" strokeWidth="0.2" opacity="0.6" />
        <path d="M20,80 L80,20" stroke="currentColor" fill="none" strokeWidth="0.2" opacity="0.5" />
      </svg>
    </div>
  );
};


const LandingPage: React.FC = () => {
  const { setShowAuthModal } = useApp();
  const [scrollY, setScrollY] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const timer = setTimeout(() => setShowContent(true), 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative h-[200vh] w-full">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-ivory">
        <ParallaxSVG scrollY={scrollY} />
        <div className={`relative z-10 text-center transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-indigo leading-tight" style={{ letterSpacing: '0.05em' }}>
            Artistry in Every Thread.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-indigo-light max-w-2xl mx-auto">
            Discover timeless handcrafted textiles that blend traditional techniques with modern aesthetics. Welcome to Asati Handloom.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="mt-12 px-10 py-4 bg-indigo text-ivory font-semibold text-lg rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-glow"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
