"""
============================================================================
RIMBERIO — Platform Configuration
Environment-aware settings for Flask application.
============================================================================
"""

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

FLASK_ENV = os.environ.get("FLASK_ENV", "production")
DEBUG = FLASK_ENV == "development"
HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", 5000))

BASE_URL = os.environ.get("BASE_URL", f"http://127.0.0.1:{PORT}")

PUBLIC_DIR = os.environ.get(
    "PUBLIC_DIR",
    os.path.normpath(os.path.join(BASE_DIR, "..", "frontend", "public"))
)

CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*")

FLAT_DELIVERY_CHARGE = int(os.environ.get("FLAT_DELIVERY_CHARGE", 399))

SUPPORTED_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"]

MAX_CART_ITEM_QTY = 99
MAX_CART_ITEMS = 50
MAX_PRICE = 1_000_000

LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")
LOG_FORMAT = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"

PRODUCT_CATALOG = {
    "tulip-infinity-lamp": {
        "name": "Tulip Infinity Mirror Cube Lamp",
        "price": 1999,
        "compareAt": 3499,
        "tag": "HOME DECOR",
    },
    "cloud-tulip-lamp": {
        "name": "Cloud Tulip Infinity Mirror Lamp",
        "price": 2299,
        "compareAt": 3299,
        "tag": "HOME DECOR",
    },
}
