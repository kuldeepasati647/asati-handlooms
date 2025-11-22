import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, Category, User, CartItem, Order } from '../types';

type Page = 'landing' | 'marketplace' | 'admin';

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  user: User | null;
  login: (email: string, password?: string) => void;
  logout: () => void;

  users: User[];
  createUser: (userData: Omit<User, 'id' | 'role'>) => Promise<void>;
  removeUser: (id: string) => Promise<void>;

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
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  updateOrderStatus: (orderId: string, status: "approved" | "declined") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  // BASIC STATES

  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([]); 

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Temporary hardcoded categories & products
  const [categories, setCategories] = useState<Category[]>([
    { id: 'c1', name: 'Clothing' },
    { id: 'c2', name: 'Home Decor' },
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Handloom Cotton Saree",
      price: 129.99,
      category: "Clothing",
      material: "Pure Handloom Cotton",
      description: "Classic handwoven saree made using traditional loom techniques.",
      imageUrl: "https://img.tatacliq.com/images/i19//437Wx649H/MP000000019481068_437Wx649H_202408050339231.jpeg",
      inventory: 10,
    },
    {
      id: 2,
      name: "Khadi Handloom Shirt",
      price: 59.50,
      category: "Clothing",
      material: "100% Organic Khadi Cotton",
      description: "Comfortable handwoven khadi shirt — breathable and premium finish.",
      imageUrl: "https://trybestonline.com/wp-content/uploads/2024/12/Premium-Handloom-Khadi-Shirt.jpg",
      inventory: 10,
    },
  ]);

  // TOAST

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // LOGIN SYSTEM

const login = (userId: string, password: string) => {
  // ADMIN LOGIN
  if (userId.toLowerCase() === "admin" && password === "admin") {
    setUser({
      _id: "admin",
      id: "admin",
      name: "Admin",
      role: "admin",
      email: "admin@asati.com",
      password: "admin",
      address: "Admin HQ"
    });
    fetchUsersFromDB();
    setCurrentPage("admin");
    showToast("Welcome Admin!", "success");
    setShowAuthModal(false);
    return;
  }

  // NORMAL USER LOGIN USING USERID + PASSWORD
  const foundUser = users.find(
    u => u.UserId.toLowerCase() === userId.toLowerCase() && u.password === password
  );

  if (foundUser) {
    setUser(foundUser);
    setCurrentPage("marketplace");
    showToast(`Welcome ${foundUser.name}!`, "success");
    setShowAuthModal(false);
  } else {
    showToast("Invalid User ID or Password!", "error");
  }
};


  const logout = () => {
    setUser(null);
    setCurrentPage('landing');
    setCart([]);
    showToast("Logged out.", "success");
  };

  // MONGODB USER CRUD API INTEGRATION

const API_BASE = "https://asati-backend.onrender.com/api/users";

const fetchUsersFromDB = async () => {
  try {
    const res = await fetch(API_BASE);
    const data = await res.json();
    setUsers(data);
  } catch (err) {
    console.error(err);
    showToast("Unable to load users.", "error");
  }
};


  // CREATE USER (POST)
  const createUser = async (userData: Omit<User, 'id' | 'role'>) => {
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      const newUser = await res.json();
      setUsers(prev => [...prev, newUser]);

      showToast("User created!", "success");
    } catch (err) {
      console.error(err);
      showToast("User creation failed.", "error");
    }
  };

  // DELETE USER
  const removeUser = async (id: string) => {
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "DELETE"
      });

      setUsers(prev => prev.filter(u => u._id !== id));
      showToast("User deleted", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete user", "error");
    }
  };

  // CART

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    showToast(`${product.name} added to cart!`, "success");
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);

    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // ORDER SYSTEM

  const placeOrder = () => {
    if (!user || cart.length === 0) return showToast("Cannot place order", "error");

    const subtotal = cart.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId: user._id || user.id,
      userName: user.name,
      items: [...cart],
      total,
      date: new Date(),
      status: "pending",
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);

    showToast("Order placed!", "success");
  };

  const updateOrderStatus = (orderId: string, status: "approved" | "declined") => {
    setOrders(prev =>
      prev.map(order => order.id === orderId ? { ...order, status } : order)
    );
    showToast(`Order ${status}`, status === "approved" ? "success" : "error");
  };

  // PROVIDER RETURN

  return (
    <AppContext.Provider value={{
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
      setOrders,
      updateOrderStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
