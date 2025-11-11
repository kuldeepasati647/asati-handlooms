
import React, { MouseEvent } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setShowAuthModal, user } = useApp();

  const handleAddToCart = (e: MouseEvent) => {
    e.stopPropagation();
    if (!user) {
        setShowAuthModal(true);
        return;
    }
    addToCart(product);
  };

  return (
    <div className="group bg-white/50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2" style={{ perspective: '1000px' }}>
      <div className="p-4 transition-transform duration-500 group-hover:transform group-hover:rotate-x-3 group-hover:rotate-y-[-3deg]">
        <div className="relative overflow-hidden rounded-lg">
          <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>
        <div className="pt-5 text-center">
          <h3 className="text-xl font-serif font-bold text-indigo">{product.name}</h3>
          <p className="text-indigo-light mt-1">{product.category}</p>
          <p className="mt-4 text-2xl font-semibold text-indigo">${product.price.toFixed(2)}</p>
        </div>
        <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
           <button 
             onClick={handleAddToCart}
             className="w-full bg-indigo text-ivory py-3 rounded-lg font-bold hover:bg-indigo-light transition-colors duration-300">
             Add to Cart
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
