import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const CheckoutModal: React.FC = () => {
    const { showCheckoutModal, setShowCheckoutModal, cart, placeOrder } = useApp();
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    if (!showCheckoutModal) return null;

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tax = subtotal * 0.1; 
    const total = subtotal + tax;

    const handleConfirmOrder = () => {
        placeOrder();
        setIsOrderPlaced(true);
    };
    
    const handleClose = () => {
        setShowCheckoutModal(false);
        setTimeout(() => {
            setIsOrderPlaced(false);
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-ivory/90 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in" onClick={handleClose}>
            <div 
                className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl relative transition-all duration-500 transform ${showCheckoutModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={e => e.stopPropagation()}
            >
                <button onClick={handleClose} className="absolute top-4 right-4 text-indigo-light hover:text-indigo z-10">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                   </svg>
                </button>
                
                {isOrderPlaced ? (
                    <div className="p-12 text-center animate-fade-in">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-3xl font-serif font-bold text-indigo mb-4">Thank You!</h2>
                        <p className="text-indigo-light mb-8">Your order has been placed. A detailed confirmation has been sent to your email.</p>
                        <button onClick={handleClose} className="bg-indigo text-ivory font-bold py-3 px-8 rounded-lg hover:bg-indigo-light transition-colors duration-300">
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="p-8">
                        <h2 className="text-3xl font-serif font-bold text-indigo mb-6 border-b border-beige pb-4">Order Summary</h2>
                        <div className="max-h-80 overflow-y-auto pr-4 space-y-4">
                            {cart.map(item => (
                                <div key={item.product.id} className="flex items-center justify-between py-2">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-20 h-20 rounded-lg object-cover shadow-sm" />
                                    <div className="ml-4 flex-1">
                                        <p className="font-semibold text-indigo">{item.product.name}</p>
                                        <p className="text-sm text-indigo-light">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-indigo text-lg">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-beige space-y-2">
                             <div className="flex justify-between text-indigo-light"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                             <div className="flex justify-between text-indigo-light"><span>Tax (10%)</span><span>₹{tax.toFixed(2)}</span></div>
                             <div className="flex justify-between font-bold text-indigo text-xl"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                        </div>
                        <div className="mt-8">
                            <button onClick={handleConfirmOrder} className="w-full bg-indigo text-ivory font-bold py-3 rounded-lg hover:bg-indigo-light transition-colors duration-300 text-lg">
                                Confirm Order
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;
