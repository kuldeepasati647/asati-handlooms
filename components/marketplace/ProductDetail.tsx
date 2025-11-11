
import React, { useState, MouseEvent } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProductDetailProps {
  product: Product;
}

const RippleButton: React.FC<{ onClick: (e: MouseEvent<HTMLButtonElement>) => void, children: React.ReactNode, className: string }> = ({ onClick, children, className }) => {
    const [ripples, setRipples] = useState<{ x: number, y: number, id: number }[]>([]);

    const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = button.offsetWidth;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        const newRipple = { x, y, id: Date.now() };

        setRipples([...ripples, newRipple]);
        onClick(event);

        setTimeout(() => {
            setRipples(current => current.filter(r => r.id !== newRipple.id));
        }, 600);
    };

    return (
        <button onClick={createRipple} className={`relative overflow-hidden ${className}`}>
            {children}
            {ripples.map(ripple => (
                <span key={ripple.id}
                    className="absolute bg-white/50 rounded-full animate-ripple"
                    style={{ left: ripple.x, top: ripple.y, width: '200%', paddingTop: '200%' }}
                />
            ))}
        </button>
    );
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { setSelectedProduct, addToCart, setShowAuthModal, user } = useApp();
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!user) {
        setShowAuthModal(true);
        return;
    }
    addToCart(product, quantity);
  };
  
  return (
    <div className="fixed inset-0 bg-ivory/90 backdrop-blur-md z-40 animate-fade-in" onClick={() => setSelectedProduct(null)}>
      <div className="container mx-auto px-6 h-full flex items-center justify-center">
        <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-auto max-h-[90vh] grid grid-cols-1 md:grid-cols-2 gap-8 p-8 overflow-y-auto relative"
            onClick={e => e.stopPropagation()}
        >
          <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-indigo-light hover:text-indigo z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="overflow-hidden rounded-lg">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110" />
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-sm font-semibold text-indigo-light uppercase">{product.category}</span>
            <h1 className="text-4xl font-serif font-bold text-indigo my-2">{product.name}</h1>
            <p className="text-3xl font-sans font-semibold text-indigo mb-4">${product.price.toFixed(2)}</p>
            <p className="text-indigo-light mb-6">{product.description}</p>
            <div className="text-sm mb-6">
                <span className="font-semibold text-indigo">Material:</span> {product.material}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-xl">-</button>
                <span className="px-4 py-2 text-lg font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 text-xl">+</button>
              </div>
              <RippleButton
                onClick={handleAddToCart}
                className="flex-grow bg-indigo text-ivory font-bold py-3 px-4 rounded-lg hover:bg-indigo-light transition-colors duration-300 transform hover:scale-105"
              >
                Add to Cart
              </RippleButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
