import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import json
import bcrypt
import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("API_KEY"),
    api_secret=os.getenv("API_SECRET"),
)

app = Flask(__name__)
CORS(app)

# ===== DATABASE =====
DATABASE_URL = os.getenv("DATABASE_URL")


def get_db_connection():
    if not DATABASE_URL:
        raise Exception("DATABASE_URL not found in environment variables")

    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    return conn


# ===== HOME =====
@app.route("/")
def home():
    return "Backend Running 🚀"


# =========================
# SIGNUP
# =========================
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json or {}

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"success": False, "message": "Missing fields"}), 400

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode("utf-8")

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            "INSERT INTO users(name, email, password) VALUES(%s,%s,%s)",
            (name, email, hashed),
        )
        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        print("SIGNUP ERROR:", e)
        return jsonify({"success": False, "message": str(e)}), 400

    finally:
        cur.close()
        conn.close()


# =========================
# LOGIN (FIXED)
# =========================
@app.route("/login", methods=["POST"])
def login():
    data = request.json or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "Missing fields"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("SELECT id, email, password FROM users WHERE email=%s", (email,))
        user = cur.fetchone()

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        if bcrypt.checkpw(password.encode(), user[2].encode()):
            return jsonify({"success": True, "user_id": user[0], "email": user[1]})

        return jsonify({"success": False, "message": "Wrong password"}), 401

    except Exception as e:
        print("LOGIN ERROR:", e)
        return jsonify({"success": False, "message": "Server error"}), 500

    finally:
        cur.close()
        conn.close()


# =========================
# GET USER
# =========================
@app.route("/user/<int:user_id>", methods=["GET"])
def get_user(user_id):

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, name, email, image FROM users WHERE id=%s", (user_id,))

    user = cur.fetchone()

    cur.close()
    conn.close()

    if user:

        return jsonify(
            {"id": user[0], "name": user[1], "email": user[2], "image": user[3]}
        )

    return jsonify({})


# =========================
# PRODUCTS
# =========================
@app.route("/products", methods=["GET"])
def get_products():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM products")
    data = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(
        [
            {"id": p[0], "name": p[1], "price": p[2], "image": p[3], "type": p[4]}
            for p in data
        ]
    )


# =========================
# ADD PRODUCT
# =========================
@app.route("/add-product", methods=["POST"])
def add_product():

    try:

        data = request.json

        if not data:
            return jsonify({"success": False, "message": "No data received"}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            INSERT INTO products (name, price, image, type)
            VALUES (%s, %s, %s, %s)
            """,
            (
                data.get("name"),
                data.get("price"),
                data.get("image"),
                data.get("type"),
            ),
        )

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"success": True, "message": "Product added successfully"})

    except Exception as e:

        print("ADD PRODUCT ERROR:", e)

        return jsonify({"success": False, "message": str(e)}), 500


# ========================
# DELETE PRODUCT
# ========================


@app.route("/delete-product/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):

    try:

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("DELETE FROM products WHERE id=%s", (product_id,))

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"success": True})

    except Exception as e:

        print("DELETE PRODUCT ERROR:", e)

        return jsonify({"success": False, "message": str(e)}), 500


# =========================
# GET ALL ORDERS
# =========================
@app.route("/admin/orders", methods=["GET"])
def get_all_orders():

    try:

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT id, name, phone, total, payment, status, items
            FROM orders
            ORDER BY id DESC
        """)

        orders = cur.fetchall()

        cur.close()
        conn.close()

        return jsonify(
            [
                {
                    "id": o[0],
                    "name": o[1],
                    "phone": o[2],
                    "total": o[3],
                    "payment": o[4],
                    "status": o[5],
                    "items": o[6],
                }
                for o in orders
            ]
        )

    except Exception as e:

        print("ORDERS ERROR:", e)

        return jsonify([]), 500


# ========================
# UPDATE ORDER STATUS
# ========================
@app.route("/admin/update-status", methods=["POST"])
def update_status():

    try:

        data = request.json

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            "UPDATE orders SET status=%s WHERE id=%s",
            (data["status"], data["order_id"]),
        )

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"success": True})

    except Exception as e:

        print("STATUS ERROR:", e)

        return jsonify({"success": False}), 500


# ========================
# DELETE ORDER
# ========================
@app.route("/order/delete", methods=["POST"])
def delete_order():

    try:

        data = request.json

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("DELETE FROM orders WHERE id=%s", (data["order_id"],))

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"success": True})

    except Exception as e:

        print("DELETE ORDER ERROR:", e)

        return jsonify({"success": False}), 500


# =========================
# UPLOAD PROFILE
# =========================
@app.route("/upload-profile/<int:user_id>", methods=["POST"])
def upload_profile(user_id):
    try:
        file = request.files.get("image")

        if not file:
            return jsonify({"success": False, "message": "No file uploaded"}), 400

        upload_result = cloudinary.uploader.upload(file)

        image_url = upload_result["secure_url"]

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("UPDATE users SET image=%s WHERE id=%s", (image_url, user_id))

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"success": True, "image": image_url})

    except Exception as e:
        print("UPLOAD ERROR:", e)
        return jsonify({"success": False, "message": str(e)}), 500


# ========================
# GET CART
# ========================
# ========================
# GET CART
# ========================


@app.route("/cart/<int:user_id>", methods=["GET"])
def get_cart(user_id):

    try:

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT id, product_id, name, price, image, quantity
            FROM cart
            WHERE user_id=%s
            """,
            (user_id,),
        )

        items = cur.fetchall()

        cur.close()
        conn.close()

        cart_items = []

        for item in items:

            cart_items.append(
                {
                    "id": item[0],
                    "product_id": item[1],
                    "name": item[2],
                    "price": float(item[3]),
                    "image": item[4],
                    "quantity": item[5],
                }
            )

        return jsonify(cart_items)

    except Exception as e:

        print("GET CART ERROR:", e)

        return jsonify([]), 500


# =========================
# CART
# =========================
@app.route("/cart/add", methods=["POST"])
def add_to_cart():
    data = request.json or {}

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT id, quantity FROM cart WHERE user_id=%s AND product_id=%s",
        (data.get("user_id"), data.get("product_id")),
    )
    existing = cur.fetchone()

    if existing:
        cur.execute(
            "UPDATE cart SET quantity=%s WHERE id=%s", (existing[1] + 1, existing[0])
        )
    else:
        cur.execute(
            "SELECT name, price, image FROM products WHERE id=%s",
            (data.get("product_id"),),
        )
        product = cur.fetchone()

        if not product:
            return jsonify({"success": False, "message": "Product not found"}), 404

        cur.execute(
            "INSERT INTO cart (user_id, product_id, name, price, image, quantity) VALUES (%s,%s,%s,%s,%s,1)",
            (
                data.get("user_id"),
                data.get("product_id"),
                product[0],
                product[1],
                product[2],
            ),
        )

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"success": True})


# =========================
# UPDATE CART
# =========================
@app.route("/cart/update", methods=["POST"])
def update_cart():

    try:

        data = request.json

        cart_id = data.get("cart_id")
        action = data.get("action")

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT quantity FROM cart WHERE id=%s", (cart_id,))

        item = cur.fetchone()

        if not item:
            return jsonify({"success": False, "message": "Cart item not found"}), 404

        qty = item[0]

        if action == "inc":
            qty += 1

        elif action == "dec":

            qty -= 1

            if qty <= 0:

                cur.execute("DELETE FROM cart WHERE id=%s", (cart_id,))

                conn.commit()

                cur.close()
                conn.close()

                return jsonify({"success": True})

        cur.execute("UPDATE cart SET quantity=%s WHERE id=%s", (qty, cart_id))

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"success": True})

    except Exception as e:

        print("UPDATE CART ERROR:", e)

        return jsonify({"success": False, "message": str(e)}), 500


# =========================
# REMOVE CART
# =========================
@app.route("/cart/remove", methods=["POST"])
def remove_cart_item():

    try:

        data = request.json

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("DELETE FROM cart WHERE id=%s", (data["cart_id"],))

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"success": True})

    except Exception as e:

        print("REMOVE CART ERROR:", e)

        return jsonify({"success": False, "message": str(e)}), 500


# =========================
# CREATE ORDER
# =========================


@app.route("/orders/create", methods=["POST"])
def create_order():

    try:

        data = request.json or {}

        user_id = data.get("user_id")
        name = data.get("name")
        phone = data.get("phone")
        address = data.get("address")
        total = data.get("total")
        payment = data.get("payment")
        items = data.get("items", [])

        if not user_id or not name or not phone or not address:

            return jsonify({"success": False, "message": "Missing fields"}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        # ===== SAVE ORDER =====
        cur.execute(
            """
            INSERT INTO orders
            (user_id, name, phone, address, total, payment, status, items)

            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
            """,
            (
                user_id,
                name,
                phone,
                address,
                float(total),
                payment,
                "Processing",
                json.dumps(items),
            ),
        )

        order_id = cur.fetchone()[0]

        # ===== CLEAR CART =====
        cur.execute("DELETE FROM cart WHERE user_id=%s", (user_id,))

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"success": True, "order_id": order_id})

    except Exception as e:

        print("ORDER ERROR:", e)

        return jsonify({"success": False, "message": str(e)}), 500


# =========================
# GET USER ORDERS
# =========================
@app.route("/orders/<int:user_id>", methods=["GET"])
def get_orders(user_id):

    try:

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT id, name, total, payment, status, items
            FROM orders
            WHERE user_id=%s
            ORDER BY id DESC
            """,
            (user_id,),
        )

        orders = cur.fetchall()

        cur.close()
        conn.close()

        result = []

        for order in orders:

            result.append(
                {
                    "id": order[0],
                    "name": order[1],
                    "total": float(order[2]),
                    "payment": order[3],
                    "status": order[4],
                    "items": order[5],
                }
            )

        return jsonify(result)

    except Exception as e:

        print("GET ORDERS ERROR:", e)

        return jsonify({"success": False, "message": str(e)}), 500


# =========================
# GET SINGLE ORDER
# =========================
@app.route("/order/<int:order_id>", methods=["GET"])
def get_single_order(order_id):

    try:

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT
                id,
                user_id,
                name,
                phone,
                address,
                total,
                payment,
                status,
                items,
                date
            FROM orders
            WHERE id=%s
            """,
            (order_id,),
        )

        order = cur.fetchone()

        cur.close()
        conn.close()

        if not order:

            return jsonify({"success": False, "message": "Order not found"}), 404

        # ===== ITEMS FIX =====
        items = []

        try:

            if order[8]:

                if isinstance(order[8], str):

                    items = json.loads(order[8])

                else:

                    items = order[8]

        except Exception as e:

            print("ITEMS ERROR:", e)

            items = []

        return jsonify(
            {
                "id": order[0],
                "user_id": order[1],
                "name": order[2],
                "phone": order[3],
                "address": order[4],
                "total": float(order[5]),
                "payment": order[6],
                "status": order[7],
                "items": items,
                "date": order[9].strftime("%d %b %Y"),
            }
        )

    except Exception as e:

        print("GET SINGLE ORDER ERROR:", e)

        return jsonify({"success": False, "message": str(e)}), 500


# =========================
# RUN (RENDER SAFE)
# =========================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

    # app.run(debug=True)
