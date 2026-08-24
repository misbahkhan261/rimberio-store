import React, { useState, useEffect, useCallback } from "react";
import { adminLogin, addProduct, fetchProducts, fetchAdminOrders, deleteProduct, updateOrderStatus, editProduct } from "../services/api";

export default function AdminModal({ isOpen, onClose, onProductAdded }) {
    // Admin login aur tab navigation ki states
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState("add");
    
    // Product form ki states (Add aur Edit dono ke liye)
    const [productKey, setProductKey] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [compareAt, setCompareAt] = useState("");
    const [tag, setTag] = useState("HOME DECOR");
    const [description, setDescription] = useState("");
    
    const [editingId, setEditingId] = useState(null);
    
    // Dashboard data lists aur search query state
    const [productsList, setProductsList] = useState([]);
    const [ordersList, setOrdersList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Error aur success alert messages ki states
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // - Backend se products aur orders ka fresh data load karta hai
    const loadDashboardData = useCallback(async () => {
        try {
            const prods = await fetchProducts();
            setProductsList(prods);
            const ords = await fetchAdminOrders();
            setOrdersList(ords);
        } catch (err) {
            console.error(err);
        }
    }, []);

    // - Jab admin login ho jaye toh dashboard data fetch karwayega
    useEffect(() => {
        if (isLoggedIn) {
            loadDashboardData();
        }
    }, [isLoggedIn, loadDashboardData]);

    if (!isOpen) return null;

    // - Admin authentication handle karta hai
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setError("");
            await adminLogin(username, password);
            setIsLoggedIn(true);
        } catch (err) {
            setError(err.message);
        }
    };

    // - Naya product add ya existing product update karta hai
    const handleAddOrUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            setError("");
            setSuccessMsg("");
            
            if (editingId) {
                await editProduct(editingId, {
                    name,
                    price: Number(price),
                    compareAt: Number(compareAt),
                    tag,
                    description
                });
                setSuccessMsg("Product updated successfully!");
                setEditingId(null);
            } else {
                await addProduct({
                    id: productKey,
                    name,
                    price: Number(price),
                    compareAt: Number(compareAt),
                    tag,
                    description
                });
                setSuccessMsg("Product added successfully!");
            }

            if (onProductAdded) onProductAdded();
            loadDashboardData();
            
            // Form reset karna
            setProductKey("");
            setName("");
            setPrice("");
            setCompareAt("");
            setTag("HOME DECOR");
            setDescription("");
        } catch (err) {
            setError(err.message);
        }
    };

    // - Edit mode start karke existing values form mein load karta hai
    const handleStartEdit = (p) => {
        setEditingId(p.id);
        setProductKey(p.id);
        setName(p.name);
        setPrice(p.price);
        setCompareAt(p.compareAt || "");
        setTag(p.tag || "HOME DECOR");
        setDescription(p.description || "");
        setActiveTab("add");
    };

    // - Product catalog se delete karta hai
    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteProduct(id);
            loadDashboardData();
            if (onProductAdded) onProductAdded();
        } catch (err) {
            alert(err.message);
        }
    };

    // - Customer order ka status update karta hai (Unverified, Confirmed, Dispatched, Completed)
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            loadDashboardData();
        } catch (err) {
            alert(err.message);
        }
    };

    // - Customer order ka printable invoice generate karta hai
    const handleDownloadInvoice = (o) => {
        const invoiceWindow = window.open("", "_blank");
        const itemsHtml = (o.items || []).map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name || 'Product'}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.qty || 1}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs ${item.price || 0}</td>
            </tr>
        `).join("");

        invoiceWindow.document.write(`
            <html>
                <head>
                    <title>Invoice #${o.id} - Rimberio</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 40px; color: #1C1A17; background: #FAF8F5; }
                        .invoice-box { max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                        h2 { font-weight: 300; margin-bottom: 5px; }
                        .details { margin: 20px 0; font-size: 14px; line-height: 1.6; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th { background: #1C1A17; color: #fff; text-align: left; padding: 10px; font-size: 13px; }
                        .total { text-align: right; margin-top: 20px; font-size: 16px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="invoice-box">
                        <h2>RIMBERIO</h2>
                        <p style="color: #777; font-size: 12px;">Executive Distribution Platform</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
                        <div class="details">
                            <strong>Invoice ID:</strong> #${o.id}<br>
                            <strong>Customer Name:</strong> ${o.customerName}<br>
                            <strong>Phone:</strong> ${o.customerPhone}<br>
                            <strong>Address:</strong> ${o.customerAddress}<br>
                            <strong>Status:</strong> ${o.status}
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th style="text-align: center;">Qty</th>
                                    <th style="text-align: right;">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                        </table>
                        <div class="dilivery" style="margin-top: 20px; font-size: 14px;">
                            <strong>Payment Method:</strong> ${o.paymentMethod || 'Card Payment /Cash on Delivery'}<br>
                                <strong>Dilivery Charges:</strong> Rs ${o.deliveryCharges || 399}
                        </div>
                        <div class="total">
                            Total Amount: Rs ${o.total}
                        </div>
                        <div style="text-align: center; margin-top: 40px;">
                            <button onclick="window.print()" style="padding: 10px 20px; background: #1C1A17; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Print / Save PDF</button>
                        </div>
                    </div>
                </body>
            </html>
        `);
        invoiceWindow.document.close();
    };

    // Total sales calculate karna
    const totalRevenue = ordersList
        .filter(o => o.status === "CONFIRMED" || o.status === "COMPLETED" || o.isVerified)
        .reduce((sum, o) => sum + (o.total || 0), 0);

    // Search query ke zariye list filter karna
    const filteredProducts = productsList.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredOrders = ordersList.filter(o => o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || String(o.id).includes(searchQuery));

    return (
        <div style={{ position: "fixed", top: "40px", left: 0, width: "100%", height: "calc(100% - 40px)", background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999, paddingTop: "40px" }}>
            <div style={{ background: "#FFF", padding: "30px", borderRadius: "16px", width: "700px", maxWidth: "95%", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
                <button onClick={onClose} style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>✕</button>
                
                {!isLoggedIn ? (
                    <form onSubmit={handleLogin}>
                        <h2 style={{ marginBottom: "20px", fontSize: "22px" }}>Admin Login</h2>
                        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "5px" }}>Username</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} required />
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "5px" }}>Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} required />
                        </div>
                        <button type="submit" style={{ width: "100%", padding: "10px", background: "#1C1A17", color: "#FFF", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>Login</button>
                    </form>
                ) : (
                    <div>
                        <h2 style={{ marginBottom: "15px", fontSize: "22px" }}>Rimberio Executive Dashboard</h2>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
                            <div style={{ background: "#FAF8F5", padding: "12px", borderRadius: "8px", border: "1px solid #EBE7E0", textAlign: "center" }}>
                                <span style={{ fontSize: "11px", color: "#777", display: "block" }}>Total Revenue</span>
                                <strong style={{ fontSize: "16px", color: "#1C1A17" }}>Rs {totalRevenue}</strong>
                            </div>
                            <div style={{ background: "#FAF8F5", padding: "12px", borderRadius: "8px", border: "1px solid #EBE7E0", textAlign: "center" }}>
                                <span style={{ fontSize: "11px", color: "#777", display: "block" }}>Total Orders</span>
                                <strong style={{ fontSize: "16px", color: "#1C1A17" }}>{ordersList.length}</strong>
                            </div>
                            <div style={{ background: "#FAF8F5", padding: "12px", borderRadius: "8px", border: "1px solid #EBE7E0", textAlign: "center" }}>
                                <span style={{ fontSize: "11px", color: "#777", display: "block" }}>Products Count</span>
                                <strong style={{ fontSize: "16px", color: "#1C1A17" }}>{productsList.length}</strong>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px", marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                            <button onClick={() => { setActiveTab("add"); setEditingId(null); }} style={{ padding: "8px 16px", background: activeTab === "add" ? "#1C1A17" : "#f0f0f0", color: activeTab === "add" ? "#fff" : "#333", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>{editingId ? "Edit Product" : "Add Product"}</button>
                            <button onClick={() => setActiveTab("products")} style={{ padding: "8px 16px", background: activeTab === "products" ? "#1C1A17" : "#f0f0f0", color: activeTab === "products" ? "#fff" : "#333", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>Manage Products</button>
                            <button onClick={() => setActiveTab("orders")} style={{ padding: "8px 16px", background: activeTab === "orders" ? "#1C1A17" : "#f0f0f0", color: activeTab === "orders" ? "#fff" : "#333", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>Customer Orders</button>
                        </div>

                        {(activeTab === "products" || activeTab === "orders") && (
                            <div style={{ marginBottom: "15px" }}>
                                <input type="text" placeholder={activeTab === "products" ? "Search products..." : "Search orders by name or ID..."} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "100%", padding: "8px", fontSize: "13px", borderRadius: "6px", border: "1px solid #ccc" }} />
                            </div>
                        )}

                        {error && <p style={{ color: "red", fontSize: "13px" }}>{error}</p>}
                        {successMsg && <p style={{ color: "green", fontSize: "13px" }}>{successMsg}</p>}

                        {activeTab === "add" && (
                            <form onSubmit={handleAddOrUpdateProduct}>
                                <div style={{ marginBottom: "10px" }}>
                                    <input type="text" placeholder="Product Key (e.g. gold-clock)" value={productKey} onChange={(e) => setProductKey(e.target.value)} style={{ width: "100%", padding: "8px", fontSize: "13px" }} required disabled={editingId !== null} />
                                </div>
                                <div style={{ marginBottom: "10px" }}>
                                    <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "8px", fontSize: "13px" }} required />
                                </div>
                                <div style={{ marginBottom: "10px" }}>
                                    <input type="number" placeholder="Price (Rs)" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: "100%", padding: "8px", fontSize: "13px" }} required />
                                </div>
                                <div style={{ marginBottom: "10px" }}>
                                    <input type="number" placeholder="Compare At Price (Rs)" value={compareAt} onChange={(e) => setCompareAt(e.target.value)} style={{ width: "100%", padding: "8px", fontSize: "13px" }} />
                                </div>
                                
                                <div style={{ marginBottom: "10px" }}>
                                    <label style={{ display: "block", marginBottom: "3px", fontSize: "12px", color: "#666" }}>Select Category / Tag</label>
                                    <select value={tag} onChange={(e) => setTag(e.target.value)} style={{ width: "100%", padding: "8px", fontSize: "13px", borderRadius: "4px", border: "1px solid #ccc" }} required>
                                        <option value="HOME DECOR">Home Decor (Lamps & Lighting)</option>
                                        <option value="vases">Vases & Pottery</option>
                                        <option value="art">Wall Art & Frames</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: "15px" }}>
                                    <textarea placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%", padding: "8px", fontSize: "13px", height: "70px" }} />
                                </div>
                                <button type="submit" style={{ width: "100%", padding: "10px", background: "#27AE60", color: "#FFF", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>{editingId ? "Update Product" : "Save & Publish Product"}</button>
                            </form>
                        )}

                        {activeTab === "products" && (
                            <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                                {filteredProducts.length === 0 ? (
                                    <p style={{ textAlign: "center", color: "#777", padding: "20px" }}>No products found.</p>
                                ) : (
                                    filteredProducts.map((p) => (
                                        <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #eee", marginBottom: "8px" }}>
                                            <div>
                                                <strong style={{ fontSize: "14px" }}>{p.name}</strong>
                                                <p style={{ fontSize: "12px", color: "#666", margin: "2px 0 0 0" }}>Rs {p.price} | Tag: {p.tag}</p>
                                            </div>
                                            <div style={{ display: "flex", gap: "6px" }}>
                                                <button onClick={() => handleStartEdit(p)} style={{ padding: "6px 10px", background: "#3498DB", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>Edit</button>
                                                <button onClick={() => handleDeleteProduct(p.id)} style={{ padding: "6px 10px", background: "#E74C3C", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>Delete</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                                {filteredOrders.length === 0 ? (
                                    <p style={{ textAlign: "center", color: "#777", padding: "20px" }}>No orders found.</p>
                                ) : (
                                    filteredOrders.map((o) => (
                                        <div key={o.id} style={{ background: "#f9f9f9", padding: "12px", borderRadius: "8px", marginBottom: "12px", border: "1px solid #e5e5e5" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                                                <strong>Order #{o.id} - {o.customerName}</strong>
                                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                    <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)} style={{ fontSize: "11px", padding: "3px 6px", borderRadius: "4px", border: "1px solid #ccc", fontWeight: "bold" }}>
                                                        <option value="UNVERIFIED">UNVERIFIED</option>
                                                        <option value="CONFIRMED">CONFIRMED</option>
                                                        <option value="DISPATCHED">DISPATCHED</option>
                                                        <option value="COMPLETED">COMPLETED</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <p style={{ fontSize: "13px", color: "#444", margin: "2px 0" }}>📞 {o.customerPhone} | ✉️ {o.customerEmail}</p>
                                            <p style={{ fontSize: "13px", color: "#444", margin: "2px 0" }}>📍 {o.customerAddress}</p>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                                                <span style={{ fontSize: "13px", fontWeight: "bold", color: "#1C1A17" }}>Total: Rs {o.total}</span>
                                                <button onClick={() => handleDownloadInvoice(o)} style={{ padding: "5px 10px", background: "#8E44AD", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}>Download Invoice</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}