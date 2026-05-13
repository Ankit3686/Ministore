// ===== BASE URL =====
const BASE_URL =
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
        ? "http://localhost:5000"
        : "https://ministore-1.onrender.com"; // 👈 deploy ke baad change

// ===== NAV MENU =====
function toggleMenu() {
    document.getElementById("nav")?.classList.toggle("show");
}

// ===== INIT ALL =====
document.addEventListener("DOMContentLoaded", () => {

    setupDropdown();
    setupUser();
    setupAdmin();
    initCartPage();

});

// ===== MOBILE DROPDOWN =====
function setupDropdown() {
    const dropdown = document.querySelector(".dropdown");
    if (!dropdown) return;

    const link = dropdown.querySelector("a");

    link.addEventListener("click", (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle("active");
        }
    });
}

// ===== USER LETTER =====
function setupUser() {
    const user_id = localStorage.getItem("user_id");
    const usernameEl = document.getElementById("username");

    if (!user_id || !usernameEl) {
        if (usernameEl) usernameEl.style.display = "none";
        return;
    }

    fetch(`${BASE_URL}/user/${user_id}`)
        .then(res => res.json())
        .then(user => {
            if (user?.name) {
                usernameEl.innerText = user.name.charAt(0).toUpperCase();
            }
        })
        .catch(() => console.log("User fetch error"));
}

// ===== ADMIN LINK =====
function setupAdmin() {
    const adminEmail = "kumar22102001ankit@gmail.com";
    const currentEmail = localStorage.getItem("loggedInEmail");
    const adminEl = document.getElementById("adminLink");

    if (adminEl) {
        adminEl.style.display =
            currentEmail === adminEmail ? "inline-block" : "none";
    }
}

// ===== CART PAGE INIT =====
function initCartPage() {
    const cartBody = document.getElementById("cartBody");
    if (!cartBody) return;

    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
        alert("Please login first ❌");
        window.location.href = "login.html";
        return;
    }

    loadCart(user_id);
}

// ===== LOAD CART =====
function loadCart(user_id) {

    fetch(`${BASE_URL}/cart/${user_id}`)

        .then(async (res) => {

            const data = await res.json();

            console.log("CART DATA:", data);

            return data;
        })

        .then(renderCart)

        .catch((err) => {

            console.log("CART ERROR:", err);

            alert("Cart load failed ❌");
        });
}

// ===== RENDER CART =====
function renderCart(cart) {
    const cartBody = document.getElementById("cartBody");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");
    const emptyCart = document.getElementById("emptyCart");
    const cartTable = document.getElementById("cartTable");

    if (!cartBody) return;

    let subtotal = 0;

    if (!cart || cart.length === 0) {
        cartBody.innerHTML = "";
        cartTable?.style.setProperty("display", "none");
        emptyCart?.style.setProperty("display", "block");
        if (subtotalEl) subtotalEl.innerText = "$0";
        if (totalEl) totalEl.innerText = "$0";
        return;
    }

    cartTable?.style.setProperty("display", "block");
    emptyCart?.style.setProperty("display", "none");

    cartBody.innerHTML = cart.map(item => {
        const qty = item.quantity || 1;
        const sub = item.price * qty;
        subtotal += sub;

        return `
        <tr>
            <td>
                <img src="${item.image}" width="60"
                onerror="this.src='https://via.placeholder.com/60'">
                ${item.name}
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <div class="qty-box">
                    <button onclick="changeQty(${item.id}, 'dec')">-</button>
                    <span>${qty}</span>
                    <button onclick="changeQty(${item.id}, 'inc')">+</button>
                </div>
            </td>
            <td>$${sub.toFixed(2)}</td>
            <td>
                <button onclick="removeItem(${item.id})">Remove</button>
            </td>
        </tr>
        `;
    }).join("");

    if (subtotalEl) subtotalEl.innerText = "$" + subtotal;

    updateTotal();
}

// ===== UPDATE TOTAL =====
function updateTotal() {
    const subtotalText =
        document.getElementById("subtotal")?.innerText || "$0";

    let subtotal = Number(subtotalText.replace("$", ""));

    const shipping = subtotal > 0 ? 20 : 0;

    const coupon = localStorage.getItem("coupon");
    const discount =
        coupon?.toUpperCase() === "ANKIT20" ? 20 : 0;

    let finalTotal = subtotal + shipping - discount;
    if (finalTotal < 0) finalTotal = 0;

    document.getElementById("total").innerText = "$" + finalTotal;
}

// ===== CHANGE QTY =====
function changeQty(cart_id, action) {
    fetch(`${BASE_URL}/cart/update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ cart_id, action })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                loadCart(localStorage.getItem("user_id"));
            } else {
                alert("Update failed ❌");
            }
        })
        .catch(() => alert("Server error ❌"));
}

// ===== REMOVE ITEM =====
function removeItem(cart_id) {
    fetch(`${BASE_URL}/cart/remove`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ cart_id })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                loadCart(localStorage.getItem("user_id"));
            } else {
                alert("Remove failed ❌");
            }
        })
        .catch(() => alert("Server error ❌"));
}

// ===== COUPON =====
function applyCoupon() {
    const code = document.getElementById("couponInput")?.value.trim();
    if (!code) return;

    if (code.toUpperCase() === "ANKIT20") {
        localStorage.setItem("coupon", "ANKIT20");
        document.getElementById("couponMessage").innerText =
            "$20 OFF Applied 🎉";
    } else {
        document.getElementById("couponMessage").innerText =
            "Invalid Coupon ❌";
    }

    updateTotal();
}

// ===== CLEAR COUPON =====
function clearCoupon() {
    localStorage.removeItem("coupon");
    document.getElementById("couponMessage").innerText =
        "Coupon Removed";
    updateTotal();
}
