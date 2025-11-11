import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Category, User, CartItem, Order } from '../types';

type Page = 'landing' | 'marketplace' | 'admin';

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  user: User | null;
  login: (id: string, password?: string) => void;
  logout: () => void;
  users: User[];
  createUser: (userData: Omit<User, 'id' | 'role'>) => void;
  removeUser: (id: string) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  toast: { message: string; type: 'success' | 'error' } | null;
  showToast: (message: string, type: 'success' | 'error') => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  showCheckoutModal: boolean;
  setShowCheckoutModal: (show: boolean) => void;
  orders: Order[];
  placeOrder: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const login = (id: string, password?: string) => {
    if (id.toLowerCase() === 'admin' && password === 'admin') {
      setUser({ id: 'admin', name: 'Admin', role: 'admin', email: 'admin@asati.com', password: 'admin', address: 'Admin HQ' });
      setCurrentPage('admin');
      showToast('Welcome Admin!', 'success');
      setShowAuthModal(false);
      return;
    }

    const foundUser = users.find(u => u.id === id && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      setCurrentPage('marketplace');
      showToast(`Welcome, ${foundUser.name}!`, 'success');
      setShowAuthModal(false);
    } else {
      showToast('Invalid credentials. Please try again.', 'error');
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('landing');
    setCart([]);
    showToast('Logged out successfully.', 'success');
  };

  const createUser = (userData: Omit<User, 'id' | 'role'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
    };
    setUsers(prev => [...prev, newUser]);
    showToast(`User account for ${newUser.name} created! ID: ${newUser.id}`, 'success');
  };

  const removeUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    showToast('User removed successfully.', 'success');
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`${product.name} added to cart!`, 'success');
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const placeOrder = () => {
    if (!user || cart.length === 0) {
      showToast('Cannot place order.', 'error');
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      items: [...cart],
      total,
      date: new Date(),
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    showToast('Order placed successfully!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        user,
        login,
        logout,
        users,
        createUser,
        removeUser,
        products,
        setProducts,
        categories,
        setCategories,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toast,
        showToast,
        showAuthModal,
        setShowAuthModal,
        selectedProduct,
        setSelectedProduct,
        showCheckoutModal,
        setShowCheckoutModal,
        orders,
        placeOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
