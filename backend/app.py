import json
import logging
import os
import secrets
import resend

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

import config
from database import db
from models import Order

logging.basicConfig(level=getattr(logging, config.LOG_LEVEL, logging.INFO), format=config.LOG_FORMAT)
logger = logging.getLogger("rimberio")

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///rimberio.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Resend API key configuration
resend.api_key = os.environ.get("RESEND_API_KEY", "re_diHMH3iB_7oKqvoY6jkmoEAtbjbuD1hkn")

db.init_app(app)

with app.app_context():
    db.create_all()

cors_origins = config.CORS_ORIGINS
if cors_origins != "*":
    cors_origins = [origin.strip() for origin in cors_origins.split(",")]

CORS(app, resources={r"/api/*": {"origins": cors_origins}})

# Admin credentials setup
ADMIN_USER = "ADMIN"
ADMIN_PASS = "32101"

@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    try:
        data = request.get_json() or {}
        if data.get("username") == ADMIN_USER and data.get("password") == ADMIN_PASS:
            return jsonify({
                "success": True, 
                "message": "Login successful!",
                "token": "rimberio_admin_secure_token_9988"
            }), 200
        return jsonify({"success": False, "message": "Invalid username or password."}), 401
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route("/api/admin/dashboard-stats", methods=["GET"])
def admin_dashboard_stats():
    try:
        orders = Order.query.all()
        total_revenue = sum(o.total for o in orders if o.status == "CONFIRMED")
        total_orders = len(orders)
        pending_orders = sum(1 for o in orders if o.status == "UNVERIFIED" or o.status == "Pending")
        confirmed_orders = sum(1 for o in orders if o.status == "CONFIRMED")
        
        stats = {
            "totalRevenue": total_revenue,
            "totalOrders": total_orders,
            "pendingOrders": pending_orders,
            "confirmedOrders": confirmed_orders,
            "activeProducts": len(config.PRODUCT_CATALOG)
        }
        return jsonify({"success": True, "stats": stats}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route("/api/admin/add-product", methods=["POST"])
def admin_add_product():
    try:
        data = request.get_json() or {}
        product_key = data.get("id")
        name = data.get("name")
        price = data.get("price")
        compare_at = data.get("compareAt")
        tag = data.get("tag")
        description = data.get("description")

        if not product_key or not name or not price:
            return jsonify({"success": False, "message": "Missing required fields."}), 400

        config.PRODUCT_CATALOG[product_key] = {
            "name": name,
            "price": float(price),
            "compareAt": float(compare_at) if compare_at else 0,
            "tag": tag or "NEW",
            "description": description or ""
        }

        return jsonify({"success": True, "message": f"Product '{name}' added successfully!"}), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route("/api/admin/orders", methods=["GET"])
def admin_get_orders():
    try:
        orders = Order.query.order_by(Order.id.desc()).all()
        orders_list = []
        for o in orders:
            orders_list.append({
                "id": o.id,
                "customerName": o.customer_name,
                "customerEmail": o.customer_email,
                "customerPhone": o.customer_phone,
                "customerAddress": o.customer_address,
                "paymentMethod": o.payment_method,
                "subtotal": o.subtotal,
                "shippingFee": o.shipping_fee,
                "total": o.total,
                "items": json.loads(o.items) if o.items else [],
                "status": o.status,
                "isVerified": o.is_verified,
            })
        return jsonify({"success": True, "orders": orders_list}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route("/api/admin/orders/<int:order_id>/status", methods=["PATCH"])
def admin_update_order_status(order_id):
    try:
        data = request.get_json() or {}
        new_status = data.get("status")
        
        order = Order.query.get(order_id)
        if not order:
            return jsonify({"success": False, "message": "Order not found."}), 404
            
        if new_status:
            order.status = new_status
            db.session.commit()
            return jsonify({"success": True, "message": f"Order #{order_id} status updated to {new_status}."}), 200
            
        return jsonify({"success": False, "message": "Missing status value."}), 400
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route("/api/admin/products/<product_id>", methods=["DELETE"])
def admin_delete_product(product_id):
    try:
        if product_id in config.PRODUCT_CATALOG:
            del config.PRODUCT_CATALOG[product_id]
            return jsonify({"success": True, "message": f"Product '{product_id}' deleted successfully!"}), 200
        return jsonify({"success": False, "message": "Product not found."}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route("/api/admin/products/<product_id>", methods=["PUT"])
def admin_edit_product(product_id):
    try:
        if product_id not in config.PRODUCT_CATALOG:
            return jsonify({"success": False, "message": "Product not found."}), 404
            
        data = request.get_json() or {}
        name = data.get("name")
        price = data.get("price")
        compare_at = data.get("compareAt")
        tag = data.get("tag")
        description = data.get("description")
        
        if name:
            config.PRODUCT_CATALOG[product_id]["name"] = name
        if price is not None:
            config.PRODUCT_CATALOG[product_id]["price"] = float(price)
        if compare_at is not None:
            config.PRODUCT_CATALOG[product_id]["compareAt"] = float(compare_at)
        if tag:
            config.PRODUCT_CATALOG[product_id]["tag"] = tag
        if description is not None:
            config.PRODUCT_CATALOG[product_id]["description"] = description
            
        return jsonify({"success": True, "message": f"Product '{product_id}' updated successfully!"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


def dynamic_inventory_builder():
    products = []
    if not os.path.exists(config.PUBLIC_DIR):
        logger.warning("Public directory not found: %s", config.PUBLIC_DIR)
        return products

    try:
        files = os.listdir(config.PUBLIC_DIR)
    except OSError as e:
        logger.error("Failed to list directory %s: %s", config.PUBLIC_DIR, e)
        return products

    for product_key, info in config.PRODUCT_CATALOG.items():
        images = []
        image_index = 1

        while True:
            image_found = False
            for extension in config.SUPPORTED_IMAGE_EXTENSIONS:
                filename = f"{product_key}-{image_index}{extension}"
                if filename in files:
                    images.append(f"{config.BASE_URL}/public/{filename}")
                    image_found = True
                    break

            if image_found:
                image_index += 1
            else:
                break

        if len(images) == 0:
            continue

        products.append({
            "id": product_key,
            "name": info["name"],
            "price": info["price"],
            "compareAt": info["compareAt"],
            "tag": info["tag"],
            "description": info.get("description", ""),
            "img1": images[0],
            "images": images,
        })

    return products


@app.route("/public/<path:filename>", methods=["GET"])
def serve_public_assets(filename):
    normalized = os.path.normpath(filename)
    if ".." in normalized or normalized.startswith(("/", "\\")):
        return jsonify({"success": False, "message": "Invalid file path."}), 400

    if not os.path.isfile(os.path.join(config.PUBLIC_DIR, normalized)):
        return jsonify({"success": False, "message": "File not found."}), 404

    return send_from_directory(config.PUBLIC_DIR, normalized)


@app.route("/api/products", methods=["GET"])
def get_products():
    try:
        return jsonify({"success": True, "products": dynamic_inventory_builder()}), 200
    except Exception as e:
        logger.error("Failed to get products: %s", e)
        return jsonify({"success": False, "message": "Unable to fetch products."}), 500


@app.route("/api/checkout", methods=["POST"])
def process_checkout():
    try:
        content_type = request.content_type or ""
        if "application/json" not in content_type:
            return jsonify({"success": False, "message": "Content-Type must be application/json."}), 400

        payload = request.get_json(silent=True)
        if payload is None:
            return jsonify({"success": False, "message": "Invalid or missing JSON body."}), 400

        cart = payload.get("cart")
        if not isinstance(cart, list) or len(cart) == 0:
            return jsonify({"success": False, "message": "Cart is empty or invalid."}), 400

        subtotal = sum(item.get("price", 0) * item.get("qty", 1) for item in cart)
        final_total = subtotal + config.FLAT_DELIVERY_CHARGE

        secret_token = secrets.token_urlsafe(32)
        
        customer_email = payload.get("customerEmail") or payload.get("email") or payload.get("customer_email") or ""
        customer_name = payload.get("customerName") or payload.get("name") or "Customer"

        order = Order(
            customer_name=customer_name,
            customer_email=customer_email,
            customer_phone=payload.get("customerPhone") or payload.get("phone"),
            customer_address=payload.get("customerAddress") or payload.get("address"),
            payment_method=payload.get("paymentMethod", "COD"),
            subtotal=subtotal,
            shipping_fee=config.FLAT_DELIVERY_CHARGE,
            total=final_total,
            items=json.dumps(cart),
            verification_token=secret_token,
            status="UNVERIFIED",
            is_verified=False
        )

        db.session.add(order)
        db.session.commit()

        if customer_email:
            verify_url = f"{config.BASE_URL}/api/verify-order?token={secret_token}"
            try:
                params = {
                    "from": "Rimberio <onboarding@resend.dev>",
                    "to": [customer_email],
                    "subject": f"Confirm Your Order #{order.id} - Rimberio",
                    "html": f"""
                    <div style="font-family: Arial, sans-serif; padding: 25px; background-color: #FAF8F5; color: #1C1A17; max-width: 500px; margin: 0 auto; border-radius: 16px; border: 1px solid #EBE7E0;">
                        <h2 style="font-family: Georgia, serif; font-weight: 300; font-size: 26px; color: #1C1A17; margin-top: 0;">Confirm Your Order</h2>
                        <p style="font-size: 14px; color: #555; line-height: 1.6;">Hello <strong>{order.customer_name}</strong>,</p>
                        <p style="font-size: 14px; color: #555; line-height: 1.6;">Thank you for shopping with us! Please click the button below to verify and confirm your order <strong>#{order.id}</strong>:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{verify_url}" style="display: inline-block; padding: 14px 28px; background-color: #1C1A17; color: #FFFFFF; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 12px; letter-spacing: 2px;">CONFIRM MY ORDER</a>
                        </div>
                        <p style="font-size: 12px; color: #999; line-height: 1.5; border-top: 1px solid #EBE7E0; padding-top: 15px;">If you did not request this order, please ignore this email.</p>
                    </div>
                    """
                }
                resend.Emails.send(params)
            except Exception as mail_error:
                logger.error("Failed to send email for Order #%s: %s", order.id, mail_error)

        return jsonify({
            "success": True,
            "message": f"Thank you for your order, {order.customer_name}! Please check your email to confirm your order.",
            "orderId": order.id,
            "cartTotal": final_total,
            "isVerified": False
        }), 201

    except Exception as e:
        logger.error("Checkout failed: %s", e)
        return jsonify({"success": False, "message": "Unable to process order. Please try again later."}), 500


@app.route("/api/verify-order", methods=["GET"])
def verify_order():
    token = request.args.get("token")
    if not token:
        return jsonify({"success": False, "message": "Missing verification token."}), 400

    order = Order.query.filter_by(verification_token=token).first()
    if not order:
        return jsonify({"success": False, "message": "Invalid or expired link."}), 404

    if order.is_verified:
        return f"""
        <div style="text-align:center; padding:60px 20px; font-family:sans-serif; background:#FAF8F5; min-height:100vh;">
            <div style="background:#FFFFFF; max-width:450px; margin:0 auto; padding:40px; border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
                <h1 style="color:#C6A15B; font-size: 28px; font-weight: 300;">Already Verified!</h1>
                <p style="color:#555;">Order <strong>#{order.id}</strong> has already been confirmed.</p>
            </div>
        </div>
        """, 200

    order.is_verified = True
    order.status = "CONFIRMED"
    db.session.commit()

    return f"""
    <div style="text-align:center; padding:60px 20px; font-family:sans-serif; background:#FAF8F5; min-height:100vh;">
        <div style="background:#FFFFFF; max-width:450px; margin:0 auto; padding:40px; border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
            <div style="width:60px; height:60px; background:#27AE60; color:#FFF; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px auto; font-size:30px;">✓</div>
            <h1 style="color:#1C1A17; font-size: 28px; font-weight: 300; margin-bottom:10px;">Order Confirmed!</h1>
            <p style="color:#555; font-size:15px; line-height:1.6;">Thank you, <strong>{order.customer_name}</strong>! Your order <strong>#{order.id}</strong> is verified and being prepared for dispatch.</p>
        </div>
    </div>
    """, 200


if __name__ == "__main__":
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)