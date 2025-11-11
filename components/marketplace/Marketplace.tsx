import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import ProductCard from './ProductCard';

const Marketplace: React.FC = () => {
  const { products, categories, setSelectedProduct } = useApp();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return products;
    return products.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
  }, [activeCategory, products]);

  const handleCategoryClick = (categoryName: string | null) => {
    setActiveCategory(categoryName);
    setAnimationKey(prev => prev + 1); // Trigger re-animation
  };

  return (
    <div className="container mx-auto px-6 py-28">
      <header className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl font-serif font-bold text-indigo">Our Collection</h1>
        <p className="text-lg text-indigo-light mt-2">Handcrafted with passion, curated for you.</p>
      </header>
      
      {categories.length > 0 && (
        <div className="flex justify-center items-center space-x-2 md:space-x-4 mb-12 flex-wrap animate-fade-in" style={{ animationDelay: '200ms' }}>
          <button 
            onClick={() => handleCategoryClick(null)} 
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${!activeCategory ? 'bg-indigo text-ivory shadow-lg' : 'bg-beige text-indigo-light hover:bg-indigo/10'}`}>
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => handleCategoryClick(cat.name)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${activeCategory === cat.name ? 'bg-indigo text-ivory shadow-lg' : 'bg-beige text-indigo-light hover:bg-indigo/10'}`}>
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {products.length > 0 ? (
        <div key={animationKey} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
          {filteredProducts.length === 0 && (
             <div className="col-span-full text-center py-16">
                <p className="text-xl text-indigo-light">No products found in this category.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <p className="text-xl text-indigo-light">Our collection is currently being woven.</p>
            <p className="text-indigo-light/80">Please check back soon, or log in as an admin to add products.</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
