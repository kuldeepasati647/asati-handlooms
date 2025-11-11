
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  material: string;
  category: string;
  imageUrl: string;
  inventory: number;
}

export interface Category {
  id:string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  address: string;
  role: 'user' | 'admin';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  total: number;
  date: Date;
}
