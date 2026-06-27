const API_BASE = "http://127.0.0.1:5000";

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

export async function submitCheckout(orderData) {
    const response = await fetch(`${API_BASE}/api/checkout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            cart: orderData.cart,
            customerName: orderData.customerName,
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