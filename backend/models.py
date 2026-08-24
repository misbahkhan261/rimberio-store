import json
from datetime import datetime
from database import db


class Order(db.Model):
    __tablename__ = "orders"

    # Unique ID aur tracking reference
    id = db.Column(db.Integer, primary_key=True)
    order_ref = db.Column(db.String(20), unique=True, nullable=True)

    # Customer ki zaruri details (email optional rakha hai)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_email = db.Column(db.String(120), nullable=True)
    customer_phone = db.Column(db.String(20), nullable=False)
    customer_address = db.Column(db.Text, nullable=False)

    # Payment ka tareeqa aur card ki security (sirf last 4 digits save honge)
    payment_method = db.Column(db.String(20), nullable=False)
    card_last4 = db.Column(db.String(4), nullable=True)

    # Cart items (JSON string) aur total pricing
    subtotal = db.Column(db.Float, nullable=True)
    shipping_fee = db.Column(db.Float, default=0.0)
    total = db.Column(db.Float, nullable=False)
    items = db.Column(db.Text, nullable=False)

    # Email verification system ke naye fields
    verification_token = db.Column(db.String(64), nullable=True)
    is_verified = db.Column(db.Boolean, default=False)

    # Order ka status (jaise UNVERIFIED se CONFIRMED) aur time
    status = db.Column(db.String(20), default="UNVERIFIED")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # API response ke liye data ko dictionary (JSON) mein convert karne wala helper function
    def to_dict(self):
        try:
            parsed_items = json.loads(self.items) if self.items else []
        except Exception:
            parsed_items = self.items

        return {
            "id": self.id,
            "orderRef": self.order_ref or f"NZ-{self.id:04d}",
            "customerName": self.customer_name,
            "customerEmail": self.customer_email,
            "customerPhone": self.customer_phone,
            "customerAddress": self.customer_address,
            "paymentMethod": self.payment_method,
            "cardLast4": self.card_last4,
            "subtotal": self.subtotal or self.total,
            "shippingFee": self.shipping_fee,
            "total": self.total,
            "items": parsed_items,
            "status": self.status,
            "isVerified": self.is_verified,
            "createdAt": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None
        }