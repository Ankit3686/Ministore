const BASE_URL =
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
        ? "http://localhost:5000"
        : "https://ministore-phdo.onrender.com"; // 🔥 CHANGE AFTER DEPLOY

// ===== MENU =====
function toggleMenu() {
    document.getElementById("nav").classList.toggle("show");
}

// ===== MOBILE DROPDOWN =====
document.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.querySelector(".dropdown");
    if (dropdown) {
        const dropdownLink = dropdown.querySelector("a");
        dropdownLink.addEventListener("click", (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle("active");
            }
        });
    }
});

// ===== LOAD CHECKOUT DATA =====
document.addEventListener("DOMContentLoaded", () => {
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
        window.location.href = "login.html";
        return;
    }

    fetch(`${BASE_URL}/cart/${user_id}`)
        .then(res => res.json())
        .then(cart => renderCheckout(cart))
        .catch(err => console.error("Checkout error:", err));
});

// ===== RENDER CHECKOUT =====
function renderCheckout(cart) {
    const itemsContainer = document.getElementById("checkoutItems");
    const subtotalEl = document.getElementById("checkoutSubtotal");
    const totalEl = document.getElementById("checkoutTotal");

    if (!itemsContainer) return;

    itemsContainer.innerHTML = "";

    let subtotal = 0;
    const shipping = 20;

    if (!cart || cart.length === 0) {
        itemsContainer.innerHTML = "<p>Your cart is empty 🛒</p>";
        subtotalEl.innerText = "$0";
        totalEl.innerText = "$0";
        return;
    }

    cart.forEach(item => {
        const qty = item.quantity || 1;
        const itemTotal = item.price * qty;
        subtotal += itemTotal;

        itemsContainer.innerHTML += `
            <div class="order-row">
                <span>${item.name} × ${qty}</span>
                <span>$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });

    subtotalEl.innerText = "$" + subtotal.toFixed(2);

    // ===== COUPON =====
    let discount = 0;
    const coupon = localStorage.getItem("coupon");
    if (coupon && coupon.toUpperCase() === "ANKIT20") discount = 20;

    let finalTotal = subtotal + shipping - discount;
    if (finalTotal < 0) finalTotal = 0;

    totalEl.innerText = "$" + finalTotal.toFixed(2);
}

// ===== PLACE ORDER =====
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".place-order-btn");
    if (!btn) return;

    btn.addEventListener("click", async () => {

        const user_id = localStorage.getItem("user_id");
        if (!user_id) return alert("Please login first ❌");

        const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
        if (!paymentMethod) return alert("Select payment method ❌");

        // ===== ADDRESS =====
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const phone = document.getElementById("phone").value.trim();

        const fullAddress =
            document.getElementById("address").value + ", " +
            document.getElementById("city").value + ", " +
            document.getElementById("state").value + " - " +
            document.getElementById("zip").value;

        if (!firstName || !lastName || !phone || !fullAddress) {
            alert("Fill all details ❌");
            return;
        }

        try {
            // ===== GET CART =====
            const res = await fetch(`${BASE_URL}/cart/${user_id}`);
            const cart = await res.json();

            if (!cart || cart.length === 0) {
                alert("Cart is empty ❌");
                return;
            }

            // ===== TOTAL CALC =====
            let subtotal = cart.reduce(
                (sum, item) => sum + item.price * (item.quantity || 1),
                0
            );

            const shipping = 20;
            const coupon = localStorage.getItem("coupon");
            const discount =
                coupon && coupon.toUpperCase() === "ANKIT20" ? 20 : 0;

            const total = subtotal + shipping - discount;

            // ===== API CALL =====
            const orderRes = await fetch(`${BASE_URL}/orders/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id,
                    items: cart,
                    total,
                    payment: paymentMethod,
                    name: firstName + " " + lastName,
                    phone,
                    address: fullAddress
                })
            });

            const data = await orderRes.json();

            if (data.success) {
                alert("Order Placed 🎉");

                // 🔥 IMPORTANT: CLEAR CART
                await Promise.all(
                    cart.map(item =>
                        fetch(`${BASE_URL}/cart/remove`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ cart_id: item.id })
                        })
                    )
                );

                localStorage.removeItem("coupon");

                window.location.href = "orders.html";
            } else {
                alert(data.message || "Order Failed ❌");
            }

        } catch (err) {
            console.error("Order error:", err);
            alert("Server error ❌");
        }
    });
});

// ===== USER LETTER =====
document.addEventListener("DOMContentLoaded", () => {
    const user_id = localStorage.getItem("user_id");
    const usernameEl = document.getElementById("username");

    if (!user_id || !usernameEl) {
        if (usernameEl) usernameEl.style.display = "none";
        return;
    }

    fetch(`${BASE_URL}/user/${user_id}`)
        .then(res => res.json())
        .then(user => {
            usernameEl.innerText = (user.name || "U")[0].toUpperCase();
        });
});

// ===== ADMIN LINK =====
document.addEventListener("DOMContentLoaded", () => {
    const adminEmail = "kumar22102001ankit@gmail.com";
    const currentEmail = localStorage.getItem("loggedInEmail");

    const adminEl = document.getElementById("adminLink");
    if (adminEl) {
        adminEl.style.display =
            currentEmail === adminEmail ? "inline-block" : "none";
    }
});

// ===== PAYMENT TOGGLE =====
function togglePayment() {
    const method = document.querySelector('input[name="payment"]:checked')?.value;

    document.getElementById("cardBox").style.display = "none";
    document.getElementById("upiBox").style.display = "none";

    if (method === "Card") document.getElementById("cardBox").style.display = "block";
    if (method === "UPI") document.getElementById("upiBox").style.display = "block";
}