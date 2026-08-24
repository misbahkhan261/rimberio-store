const API_BASE = "";

// - Backend se saare products fetch karta hai aur unhein properly map/format karta hai
export async function fetchProducts() {
    const response = await fetch(`${API_BASE}/api/products`);

    if (!response.ok) {
        throw new Error("Failed to load products");
    }

    const data = await response.json();

    if (!data.success) {
        throw new Error("Backend returned error");
    }

    return data.products.map(product => ({
        ...product,
        currentPreview: product.img1,
        selectedVariant: null,
        variants: product.images.map((img, index) => ({
            name: `Variant ${index + 1}`,
            image: img
        }))
    }));
}

// - Customer ka checkout data (cart items aur address) backend par bhejta hai taake order place ho sakay
export async function submitCheckout(orderData) {
    const response = await fetch(`${API_BASE}/api/checkout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            cart: orderData.cart,
            customerName: orderData.customerName,
            customerEmail: orderData.customerEmail,
            customerPhone: orderData.customerPhone,
            customerAddress: orderData.customerAddress,
            paymentMethod: orderData.paymentMethod,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Checkout failed.");
    }

    return response.json();
}

// ======================
// ADMIN API FUNCTIONS
// ======================

// - Admin login verify karne ke liye
export async function adminLogin(username, password) {
    const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");
    return data;
}

// - Naya product store mein add karne ke liye
export async function addProduct(productData) {
    const response = await fetch(`${API_BASE}/api/admin/add-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to add product");
    return data;
}

// - Admin dashboard ke liye saare customer orders fetch karta hai
export async function fetchAdminOrders() {
    const response = await fetch(`${API_BASE}/api/admin/orders`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch orders");
    return data.orders;
}

// - Kisi product ko catalog se delete karne ke liye
export async function deleteProduct(productId) {
    const response = await fetch(`${API_BASE}/api/admin/products/${productId}`, {
        method: "DELETE"
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to delete product");
    return data;
}

// - Customer order ka status update karne ke liye (e.g. Confirmed, Dispatched)
export async function updateOrderStatus(orderId, status) {
    const response = await fetch(`${API_BASE}/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update order status");
    return data;
}

// - Existing product ki details update (edit) karne ke liye
export async function editProduct(productId, productData) {
    const response = await fetch(`${API_BASE}/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update product");
    return data;
}