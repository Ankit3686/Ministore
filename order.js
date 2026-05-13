// ===== BASE URL =====
const BASE_URL =
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
        ? "http://localhost:5000"
        : "https://ministore-1.onrender.com"; // 👈 render URL daalna

// ===== NAV MENU =====
function toggleMenu() {
    document.getElementById("nav")?.classList.toggle("show");
}

// ===== INIT ALL =====
document.addEventListener("DOMContentLoaded", () => {
    setupDropdown();
    setupUser();
    setupAdmin();
    initOrdersPage();
});

// ===== INIT ORDERS =====
function initOrdersPage() {
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
        window.location.href = "login.html";
        return;
    }

    loadOrders(user_id);
}

// ===== LOAD ORDERS =====
function loadOrders(user_id) {
    fetch(`${BASE_URL}/orders/${user_id}`)
        .then(res => res.json())
        .then(renderOrders)
        .catch(() => console.error("Order Load Error ❌"));
}

// ===== RENDER ORDERS =====
function renderOrders(orders) {
    const container = document.getElementById("orders");
    if (!container) return;

    if (!orders || orders.length === 0) {
        container.innerHTML = "<tr><td colspan='5'>No Orders Found</td></tr>";
        return;
    }

    container.innerHTML = orders.map(order => {

        let items = [];

        // handle string JSON
        if (typeof order.items === "string") {
            try {
                items = JSON.parse(order.items);
            } catch {
                items = [];
            }
        } else if (Array.isArray(order.items)) {
            items = order.items;
        }

        const products = items.map(i => {
            const name = i.name || "Item";
            const qty = i.quantity || 1;
            return `<div class="badge">${name} × ${qty}</div>`;
        }).join("");

        return `
        <tr>
            <td>${order.id || "-"}</td>
            <td>${order.name || "-"}</td>
            <td>${products || "-"}</td>
            <td>
                <span class="status ${order.status || ""}">
                    ${order.status || "pending"}
                </span>
            </td>
            <td>
                <button class="delete-btn"
                    onclick="deleteOrder(${order.id})">
                    Delete
                </button>
            </td>
        </tr>
        `;
    }).join("");
}

// ===== DELETE ORDER =====
function deleteOrder(orderId) {
    if (!confirm("Delete this order? ❌")) return;

    fetch(`${BASE_URL}/order/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ order_id: orderId })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Order Deleted ✅");
                loadOrders(localStorage.getItem("user_id"));
            } else {
                alert("Delete Failed ❌");
            }
        })
        .catch(() => console.error("Delete error ❌"));
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
                usernameEl.innerText =
                    user.name.charAt(0).toUpperCase();
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
