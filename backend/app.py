"""
============================================================================
RIMBERIO — Executive Distribution Platform Layer
Dynamic Auto Product & Image Scanner
Production-Ready Flask Application
============================================================================
"""
import json
print("NEW APP.PY IS RUNNING")
import logging
import os


print("APP VERSION 2 LOADED")
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

db.init_app(app)

with app.app_context():
    db.create_all()

cors_origins = config.CORS_ORIGINS
if cors_origins != "*":
    cors_origins = [origin.strip() for origin in cors_origins.split(",")]

CORS(app, resources={r"/api/*": {"origins": cors_origins}})


def dynamic_inventory_builder():
    """
    Scans the configured public directory for product images and builds
    a product inventory list based on the product catalog configuration.
    """
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
                    images.append(
                        f"{config.BASE_URL}/public/{filename}"
                    )
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
            "img1": images[0],
            "images": images,
        })

    logger.info("Built inventory with %d products", len(products))
    return products


@app.route("/public/<path:filename>", methods=["GET"])
def serve_public_assets(filename):
    """Serve static product assets with directory traversal protection."""
    normalized = os.path.normpath(filename)
    if ".." in normalized or normalized.startswith(("/", "\\")):
        logger.warning("Blocked directory traversal attempt: %s", filename)
        return jsonify({"success": False, "message": "Invalid file path."}), 400

    if not os.path.isfile(os.path.join(config.PUBLIC_DIR, normalized)):
        return jsonify({"success": False, "message": "File not found."}), 404

    return send_from_directory(config.PUBLIC_DIR, normalized)


@app.route("/api/products", methods=["GET"])
def get_products():
    """Return the dynamically built product inventory."""
    try:
        return jsonify({
            "success": True,
            "products": dynamic_inventory_builder(),
        }), 200

    except Exception as e:
        print("DATABASE ERROR:", e)

        logger.error("Checkout failed: %s", e)

        return jsonify({
        "success": False,
        "message": "Unable to process order. Please try again later.",
        }), 500

@app.route("/api/checkout", methods=["POST"])
def process_checkout():
    """Process checkout with validated cart data."""
    print("PROCESS_CHECKOUT CALLED")
    
    try:
        content_type = request.content_type or ""
        if "application/json" not in content_type:
            return jsonify({
                "success": False,
                "message": "Content-Type must be application/json.",
            }), 400

        payload = request.get_json(silent=True)
        if payload is None:
            return jsonify({
                "success": False,
                "message": "Invalid or missing JSON body.",
            }), 400

        cart = payload.get("cart")
        if not isinstance(cart, list):
            return jsonify({
                "success": False,
                "message": "Cart must be a list of items.",
            }), 400

        if len(cart) == 0:
            return jsonify({
                "success": False,
                "message": "Cart is empty.",
            }), 400

        if len(cart) > config.MAX_CART_ITEMS:
            return jsonify({
                "success": False,
                "message": f"Cart cannot exceed {config.MAX_CART_ITEMS} items.",
            }), 400

        subtotal = 0
        for index, item in enumerate(cart):
            if not isinstance(item, dict):
                return jsonify({
                    "success": False,
                    "message": f"Cart item at index {index} is invalid.",
                }), 400

            price = item.get("price")
            qty = item.get("qty")

            if not isinstance(price, (int, float)) or price < 0 or price > config.MAX_PRICE:
                return jsonify({
                    "success": False,
                    "message": f"Invalid price for cart item at index {index}.",
                }), 400

            if not isinstance(qty, int) or qty < 1 or qty > config.MAX_CART_ITEM_QTY:
                return jsonify({
                    "success": False,
                    "message": f"Invalid quantity for cart item at index {index}. Must be 1-{config.MAX_CART_ITEM_QTY}.",
                }), 400

            subtotal += price * qty

        final_total = subtotal + config.FLAT_DELIVERY_CHARGE
        print("TEST DATABASE CODE")

        order = Order(
            customer_name=payload.get("customerName"),
            customer_phone=payload.get("customerPhone"),
            customer_address=payload.get("customerAddress"),
            payment_method=payload.get("paymentMethod"),
            total=final_total,
            items=json.dumps(cart),
            status="Pending",
        )

        db.session.add(order)
        db.session.commit()

        logger.info(
            "Order #%s saved successfully.",
            order.id
        )

        return jsonify({
            "success": True,
            "message": f"Thank you for your order, {order.customer_name}! We will notify you when your items are on the way.",
            "orderId": order.id,
            "cartTotal": final_total,
        }), 201
    except Exception as e:
        logger.error("Checkout failed: %s", e)
        return jsonify({
            "success": False,
            "message": "Unable to process order. Please try again later.",
        }), 500


if __name__ == "__main__":
    logger.info(
        "Starting Rimberio server on %s:%s (env=%s, debug=%s)",
        config.HOST, config.PORT, config.FLASK_ENV, config.DEBUG
    )
    app.run(
        host=config.HOST,
        port=config.PORT,
        debug=config.DEBUG,
    )