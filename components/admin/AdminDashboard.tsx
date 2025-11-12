import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Category, User, Order } from '../../types';

const ProductRow: React.FC<{ product: Product; onEdit: (product: Product) => void; onDelete: (id: number) => void; style: React.CSSProperties }> = ({ product, onEdit, onDelete, style }) => (
    <tr className="border-b border-indigo/10 hover:bg-indigo/5 animate-fade-in" style={style}>
        <td className="p-3"><img src={product.imageUrl} alt={product.name} className="w-16 h-12 object-cover rounded" /></td>
        <td className="p-3 font-semibold text-indigo">{product.name}</td>
        <td className="p-3 text-indigo-light">{product.category}</td>
        <td className="p-3 text-indigo-light">₹{product.price.toFixed(2)}</td>
        <td className="p-3 text-indigo-light">{product.inventory}</td>
        <td className="p-3 flex space-x-4">
            <button onClick={() => onEdit(product)} className="text-indigo hover:underline">Edit</button>
            <button onClick={() => onDelete(product.id)} className="text-red-500 hover:underline">Delete</button>
        </td>
    </tr>
);

const ProductForm: React.FC<{ product: Partial<Product> | null; onSave: (product: Product) => void; onCancel: () => void }> = ({ product, onSave, onCancel }) => {
    const { categories } = useApp();
    const [formData, setFormData] = useState(product || {});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'inventory' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Product);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white/60 rounded-xl shadow-lg animate-slide-in-right border border-beige">
            <h3 className="text-2xl font-serif font-bold text-indigo">{product?.id ? 'Edit Product' : 'Add New Product'}</h3>
            <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Product Name" className="w-full p-3 bg-beige border-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo text-indigo" required />
            <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Description" className="w-full p-3 bg-beige border-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo text-indigo" required />
            <div className="grid grid-cols-2 gap-4">
                <input name="price" type="number" step="0.01" value={formData.price || ''} onChange={handleChange} placeholder="Price" className="w-full p-3 bg-beige border-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo text-indigo" required />
                <input name="inventory" type="number" value={formData.inventory || ''} onChange={handleChange} placeholder="Inventory" className="w-full p-3 bg-beige border-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo text-indigo" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <input name="material" value={formData.material || ''} onChange={handleChange} placeholder="Material" className="w-full p-3 bg-beige border-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo text-indigo" required />
                <select name="category" value={formData.category || ''} onChange={handleChange} className="w-full p-3 bg-beige border-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo text-indigo" required>
                    <option value="" disabled>Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
            </div>
            <input name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} placeholder="Image URL" className="w-full p-3 bg-beige border-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo text-indigo" required />
            <div className="flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="px-5 py-2 bg-gray-200 rounded-lg text-indigo-light hover:bg-gray-300 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo rounded-lg text-ivory hover:bg-indigo-light transition-colors">Save</button>
            </div>
        </form>
    );
};

const CategoryManager: React.FC = () => {
    const { categories, setCategories, showToast, products } = useApp();
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName.trim() === '') return;
        const newCategory: Category = { id: Date.now().toString(), name: newCategoryName.trim() };
        if (categories.some(c => c.name.toLowerCase() === newCategory.name.toLowerCase())) {
            showToast('Category already exists.', 'error');
            return;
        }
        setCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
        setNewCategoryName('');
        showToast('Category added!', 'success');
    };

    const handleDeleteCategory = (id: string) => {
        const categoryToDelete = categories.find(c => c.id === id);
        if (!categoryToDelete) return;

        const productsInCategory = products.filter(p => p.category === categoryToDelete.name);
        if (productsInCategory.length > 0) {
            showToast(`Cannot delete category. ${productsInCategory.length} product(s) are using it.`, 'error');
            return;
        }

        if (window.confirm(`Are you sure you want to delete the "${categoryToDelete.name}" category?`)) {
            setCategories(prev => prev.filter(c => c.id !== id));
            showToast('Category deleted.', 'success');
        }
    };

    return (
        <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-beige shadow-lg animate-slide-in-right">
            <h3 className="text-2xl font-serif font-bold text-indigo mb-4">Manage Categories</h3>
            <form onSubmit={handleAddCategory} className="flex space-x-2 mb-4">
                <input
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    placeholder="New Category Name"
                    className="w-full p-3 bg-beige border-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo text-indigo"
                />
                <button type="submit" className="px-5 py-2 bg-indigo rounded-lg text-ivory font-semibold hover:bg-indigo-light transition-colors">Add</button>
            </form>
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {categories.map(cat => (
                    <li key={cat.id} className="flex justify-between items-center p-2 bg-beige/50 rounded-lg">
                        <span className="text-indigo">{cat.name}</span>
                        <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Delete</button>
                    </li>
                ))}
                {categories.length === 0 && <p className="text-indigo-light text-center py-4">No categories yet.</p>}
            </ul>
        </div>
    );
};

const UserManager: React.FC = () => {
    const { users, createUser, removeUser, showToast } = useApp();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.email && formData.password && formData.address) {
            createUser(formData);
            setFormData({ name: '', email: '', password: '', address: '' });
        } else {
            showToast('Please fill all fields.', 'error');
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            removeUser(id);
            showToast('User deleted.', 'success');
        }
    };

    return (
        <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-beige shadow-lg">
            <h2 className="text-2xl font-serif font-bold mb-4">Manage Users</h2>

            {/* Add User Form */}
            <form onSubmit={handleSubmit} className="space-y-4 p-4 mb-6 bg-beige/50 rounded-lg">
                <h3 className="text-xl font-serif font-bold text-indigo">Add New User</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full p-3 bg-ivory border-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo text-indigo" required />
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-3 bg-ivory border-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo text-indigo" required />
                </div>
                <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full p-3 bg-ivory border-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo text-indigo" required />
                <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" rows={2} className="w-full p-3 bg-ivory border-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo text-indigo" required />
                <div className="flex justify-end">
                    <button type="submit" className="px-5 py-2 bg-indigo rounded-lg text-ivory hover:bg-indigo-light transition-colors">Create User</button>
                </div>
            </form>

            {/* Existing Users Table */}
            <div className="overflow-x-auto">
                <h3 className="text-xl font-serif font-bold text-indigo mb-2">Existing Users</h3>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b-2 border-indigo/20">
                            <th className="p-3 font-semibold">User ID</th>
                            <th className="p-3 font-semibold">Name</th>
                            <th className="p-3 font-semibold">Email</th>
                            <th className="p-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.id} className="border-b border-indigo/10 hover:bg-indigo/5 cursor-pointer">
                                    <td className="p-3 font-mono text-sm text-indigo-light" onClick={() => setSelectedUser(user)}>{user.id}</td>
                                    <td className="p-3 font-semibold text-indigo" onClick={() => setSelectedUser(user)}>{user.name}</td>
                                    <td className="p-3 text-indigo-light" onClick={() => setSelectedUser(user)}>{user.email}</td>
                                    <td className="p-3 flex space-x-2">
                                        <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={4} className="text-center py-10 text-indigo-light">No users created yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg animate-slide-in-top">
                        <h3 className="text-2xl font-bold text-indigo mb-4">{selectedUser.name}</h3>
                        <p><span className="font-semibold">Email:</span> {selectedUser.email}</p>
                        <p><span className="font-semibold">Address:</span> {selectedUser.address}</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setSelectedUser(null)} className="px-4 py-2 bg-indigo rounded-lg text-ivory hover:bg-indigo-light">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const OrderNotifications: React.FC = () => {
    const { orders } = useApp();

    return (
        <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-beige shadow-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif font-bold mb-4">Order Notifications</h2>
            {orders.length === 0 ? (
                <p className="text-center py-10 text-indigo-light">No new orders.</p>
            ) : (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {orders.map(order => (
                        <div key={order.id} className="bg-beige/50 p-4 rounded-lg animate-fade-in">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-indigo">{order.userName}</p>
                                    <p className="text-sm text-indigo-light">Order ID: {order.id}</p>
                                    <p className="text-xs text-indigo-light/70">{order.date.toLocaleString()}</p>
                                </div>
                                <p className="text-xl font-bold text-indigo">₹{order.total.toFixed(2)}</p>
                            </div>
                            <div className="mt-2 border-t border-indigo/10 pt-2">
                                <ul className="text-sm space-y-1">
                                    {order.items.map(item => (
                                        <li key={item.product.id} className="flex justify-between">
                                            <span>{item.product.name} x {item.quantity}</span>
                                            <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
};

const ProductManager: React.FC = () => {
    const { products, setProducts, showToast } = useApp();
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

    const handleSave = (productToSave: Product) => {
        if (productToSave.id) {
            setProducts(prev => prev.map(p => p.id === productToSave.id ? productToSave : p));
            showToast('Product updated successfully!', 'success');
        } else {
            const newProduct = { ...productToSave, id: Date.now() };
            setProducts(prev => [newProduct, ...prev]);
            showToast('Product added successfully!', 'success');
        }
        setEditingProduct(null);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(prev => prev.filter(p => p.id !== id));
            showToast('Product deleted.', 'success');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-beige shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-serif font-bold">Manage Products</h2>
                        <button onClick={() => setEditingProduct({})} className="px-4 py-2 bg-indigo rounded-lg text-ivory font-semibold hover:bg-indigo-light transition-colors">Add Product</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-indigo/20">
                                    <th className="p-3 font-semibold">Image</th>
                                    <th className="p-3 font-semibold">Name</th>
                                    <th className="p-3 font-semibold">Category</th>
                                    <th className="p-3 font-semibold">Price</th>
                                    <th className="p-3 font-semibold">Stock</th>
                                    <th className="p-3 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    products.map((p, index) => <ProductRow key={p.id} product={p} onEdit={setEditingProduct} onDelete={handleDelete} style={{ animationDelay: `${index * 50}ms` }} />)
                                ) : (
                                    <tr><td colSpan={6} className="text-center py-10 text-indigo-light">No products yet. Click "Add Product" to start.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="space-y-8">
                <CategoryManager />
                {editingProduct && <ProductForm product={editingProduct} onSave={handleSave} onCancel={() => setEditingProduct(null)} />}
            </div>
        </div>
    );
};


const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'products' | 'users' | 'notifications'>('products');
    const { orders } = useApp();

    const TabButton: React.FC<{ tabName: typeof activeTab, children: React.ReactNode, notificationCount?: number }> = ({ tabName, children, notificationCount }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`relative px-6 py-3 rounded-t-lg font-serif text-xl transition-colors duration-300 ${activeTab === tabName ? 'bg-white/60 border-b-4 border-indigo text-indigo' : 'bg-transparent text-indigo-light hover:bg-white/20'}`}
        >
            {children}
            {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-pulse">
                    {notificationCount}
                </span>
            )}

        </button>
    );

    return (
        <div className="min-h-screen bg-ivory text-indigo pt-28 pb-12 animate-fade-in">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-serif font-bold mb-8 text-center">Admin Dashboard</h1>

                <div className="flex justify-center border-b-2 border-indigo/10 mb-8">
                    <TabButton tabName="products">Manage Products</TabButton>
                    <TabButton tabName="users">Manage Users</TabButton>
                    <TabButton tabName="notifications" notificationCount={orders.length}> Manage Notifications </TabButton>
                </div>

                <div>
                    {activeTab === 'products' && <ProductManager />}
                    {activeTab === 'users' && <UserManager />}
                    {activeTab === 'notifications' && <OrderNotifications />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;