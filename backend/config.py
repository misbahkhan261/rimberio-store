import os

# Base directory path set kar rahe hain
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Server environment aur host/port configurations
FLASK_ENV = os.environ.get("FLASK_ENV", "production")
DEBUG = FLASK_ENV == "development"
HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", 5000))

BASE_URL = os.environ.get("BASE_URL", f"http://127.0.0.1:{PORT}")

# Frontend ke public assets folder ka path
PUBLIC_DIR = os.environ.get(
    "PUBLIC_DIR",
    os.path.normpath(os.path.join(BASE_DIR, "..", "frontend", "public"))
)

CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*")

# Delivery charges (agar change karni ho toh yahan se value badal sakte hain)
FLAT_DELIVERY_CHARGE = int(os.environ.get("FLAT_DELIVERY_CHARGE", 399))

SUPPORTED_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"]

MAX_CART_ITEM_QTY = 99
MAX_CART_ITEMS = 50
MAX_PRICE = 1_000_000

LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")
LOG_FORMAT = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"

# Email settings (SMTP configuration)
MAIL_SERVER = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
MAIL_PORT = int(os.environ.get("MAIL_PORT", 587))
MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS", "True").lower() in ["true", "on", "1"]
MAIL_USERNAME = os.environ.get("MAIL_USERNAME", "yourbrandemail@gmail.com")
MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD", "xxxx xxxx xxxx xxxx")  # App Password

# Product Catalog (Yahan aap apne products add, edit ya delete kar sakte hain)
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
    "decorative-set-of-3-flower-frame-wall-shelves": {
        "name": "Decorative Set of 3 Flower Frame Wall Shelves",
        "price": 499,
        "compareAt": 999,
        "tag": "art",
        "description": "Exquisite wall art frame shelves designed to elevate your living space.",
    },
}