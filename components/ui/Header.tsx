import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CartItem } from '../../types';

const CartIcon: React.FC = () => {
  const { cart, setShowAuthModal, user } = useApp();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleIconClick = () => {
    if (!user) {
        setShowAuthModal(true);
        return;
    }
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="relative">
      <button onClick={handleIconClick} className="relative transition-transform duration-300 hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {totalItems}
          </span>
        )}
      </button>
      {isCartOpen && <CartDropdown setIsCartOpen={setIsCartOpen} />}
    </div>
  );
};

const CartDropdown: React.FC<{ setIsCartOpen: (isOpen: boolean) => void }> = ({ setIsCartOpen }) => {
    const { cart, removeFromCart, updateCartQuantity, setShowCheckoutModal } = useApp();

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2);

    const handleCheckout = () => {
        setIsCartOpen(false);
        setShowCheckoutModal(true);
    }

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white/80 backdrop-blur-md rounded-lg shadow-2xl z-50 border border-beige">
            <div className="p-4">
                <h3 className="text-lg font-serif font-bold text-indigo">Your Cart</h3>
                <div className="mt-4 max-h-64 overflow-y-auto pr-2">
                    {cart.length === 0 ? (
                        <p className="text-indigo-light">Your cart is empty.</p>
                    ) : (
                        cart.map((item: CartItem) => (
                            <div key={item.product.id} className="flex items-center justify-between py-2 border-b border-beige">
                                <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 rounded-md object-cover" />
                                <div className="ml-3 flex-1">
                                    <p className="font-semibold text-indigo">{item.product.name}</p>
                                    <p className="text-sm text-indigo-light">${item.product.price.toFixed(2)}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center">
                                       <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="px-2 text-lg">-</button>
                                       <span className="w-6 text-center">{item.quantity}</span>
                                       <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="px-2 text-lg">+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 text-xs hover:underline">Remove</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {cart.length > 0 && (
                    <div className="mt-4">
                        <div className="flex justify-between font-bold text-indigo">
                            <span>Total:</span>
                            <span>${total}</span>
                        </div>
                        <button onClick={handleCheckout} className="w-full mt-4 bg-indigo text-ivory py-2 rounded-lg font-semibold hover:bg-indigo-light transition-colors duration-300">
                            Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


const Header: React.FC = () => {
  const { user, logout, setShowAuthModal, setCurrentPage, setSelectedProduct } = useApp();

  const handleLogoClick = () => {
    setSelectedProduct(null);
    if(user?.role === 'admin') {
        setCurrentPage('admin');
    } else if (user?.role === 'user') {
        setCurrentPage('marketplace');
    } else {
        setCurrentPage('landing');
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ivory/80 backdrop-blur-sm transition-all duration-300">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div
          className="text-3xl font-serif font-bold text-indigo cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={handleLogoClick}
        >
          Asati
        </div>
        <div className="flex items-center space-x-6">
          <CartIcon />
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-indigo">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-transparent border border-indigo text-indigo rounded-full text-sm font-semibold hover:bg-indigo hover:text-ivory transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-5 py-2 bg-indigo text-ivory rounded-full text-sm font-semibold hover:bg-indigo-light transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
