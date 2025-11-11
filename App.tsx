import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './components/landing/LandingPage';
import AuthModal from './components/auth/AuthModal';
import Marketplace from './components/marketplace/Marketplace';
import AdminDashboard from './components/admin/AdminDashboard';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import Toast from './components/ui/Toast';
import ProductDetail from './components/marketplace/ProductDetail';
import CheckoutModal from './components/checkout/CheckoutModal';
import Preloader from './components/ui/Preloader';

const AppContent: React.FC = () => {
    const { currentPage, showAuthModal, selectedProduct } = useApp();

    return (
        <div className="min-h-screen flex flex-col font-sans bg-ivory text-indigo">
            <Header />
            <main className="flex-grow">
                <div className="relative">
                    {currentPage === 'landing' && <LandingPage />}
                    {currentPage === 'marketplace' && <Marketplace />}
                    {currentPage === 'admin' && <AdminDashboard />}
                    {selectedProduct && <ProductDetail product={selectedProduct} />}
                    <AuthModal isVisible={showAuthModal} />
                    <CheckoutModal />
                </div>
            </main>
            <Footer />
            <Toast />
        </div>
    );
};

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <AppProvider>
            {isLoading ? (
                <Preloader onLoaded={() => setIsLoading(false)} />
            ) : (
                <AppContent />
            )}
        </AppProvider>
    );
};

export default App;