// ===== BASE URL =====
const BASE_URL =
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
        ? "http://localhost:5000"
        : "https://ministore-1.onrender.com"; // 👈 deploy ke baad change

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    setupUserLetter();
    setupAdminLink();
    setupDropdown();
});

// ===== NAV MENU =====
function toggleMenu() {
    document.getElementById("nav")?.classList.toggle("show");
}

// ===== LOAD PRODUCTS =====
function loadProducts() {
    fetch(`${BASE_URL}/products`)
        .then(res => res.json())
        .then(renderProducts)
        .catch(err => console.error("Product error:", err));
}

// ===== RENDER PRODUCTS =====
function renderProducts(data) {
    const container1 = document.getElementById("productContainer");
    const container2 = document.getElementById("productContainer2");

    if (!container1 || !container2) return;

    container1.innerHTML = "";
    container2.innerHTML = "";

    data.forEach(product => {
        const card = createProductCard(product);

        if (product.type === "Phones") {
            container1.appendChild(card);
        } else {
            container2.appendChild(card);
        }
    });
}

// ===== PRODUCT CARD =====
function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "shop-card";

    card.innerHTML = `
        <div class="img-box">
            <img src="${product.image}"
                onerror="this.src='https://via.placeholder.com/150'">

            <button class="cart-btn" onclick="addToCart(${product.id})">
                Add To Cart
            </button>
        </div>

        <div class="shop-text">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
        </div>
    `;

    return card;
}

// ===== ADD TO CART =====
function addToCart(product_id) {
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
        alert("Please login first ❌");
        window.location.href = "login.html";
        return;
    }

    fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, product_id })
    })
        .then(res => res.json())
        .then(data => {
            alert(data.message || "Product Added To Cart 🛒");
        })
        .catch(err => console.error("Cart error:", err));
}

// ===== USER LETTER =====
function setupUserLetter() {
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
        .catch(err => console.error("User fetch error:", err));
}

// ===== ADMIN LINK =====
function setupAdminLink() {
    const adminEmail = "kumar22102001ankit@gmail.com";
    const currentEmail = localStorage.getItem("loggedInEmail");
    const adminEl = document.getElementById("adminLink");

    if (adminEl) {
        adminEl.style.display =
            currentEmail === adminEmail ? "inline-block" : "none";
    }
}

// ===== DROPDOWN =====
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
