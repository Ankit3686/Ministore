// ===== BASE URL =====
const BASE_URL =
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
        ? "http://localhost:5000"
        : "https://ministore-phdo.onrender.com"; // 👈 yaha apna backend URL daalna

// ===== NAV MENU =====
function toggleMenu() {
    document.getElementById("nav").classList.toggle("show");
}

// ===== MOBILE DROPDOWN =====
document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".dropdown");
    if (dropdown) {
        const dropdownLink = dropdown.querySelector("a");

        dropdownLink.addEventListener("click", function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle("active");
            }
        });
    }
});

// ===== ADMIN SECURITY =====
const adminEmail = "kumar22102001ankit@gmail.com";
const currentEmail = localStorage.getItem("loggedInEmail");

if (currentEmail !== adminEmail) {
    alert("Access Denied ❌");
    window.location.href = "login.html";
}

// ===== ADD PRODUCT =====
function addProduct() {
    const name = document.getElementById("pName").value;
    const price = document.getElementById("pPrice").value;
    const image = document.getElementById("pImage").value;
    const type =
        document.getElementById("sectionSelect").value === "1"
            ? "Phones"
            : "Watches";

    if (!name || !price || !image) {
        alert("Please fill all fields ❌");
        return;
    }

    fetch(`${BASE_URL}/add-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, image, type }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                alert("Product Added ✅");
                loadProducts();
            } else {
                alert("Error ❌");
            }

            document.getElementById("pName").value = "";
            document.getElementById("pPrice").value = "";
            document.getElementById("pImage").value = "";
        })
        .catch((err) => console.error(err));
}

// ===== LOAD PRODUCTS =====
function loadProducts() {
    fetch(`${BASE_URL}/products`)
        .then((res) => res.json())
        .then((data) => {
            const container = document.getElementById("adminProducts");
            if (!container) return;

            container.innerHTML = "";

            data.forEach((product) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                <td>${product.id}</td>
                <td>
                    <img src="${product.image}" width="50"
                    onerror="this.src='https://via.placeholder.com/50'">
                </td>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td>${product.type}</td>
                <td>
                    <button onclick="deleteProduct(${product.id})">
                        Delete
                    </button>
                </td>
            `;

                container.appendChild(row);
            });
        })
        .catch((err) => console.error(err));
}

// ===== DELETE PRODUCT =====
function deleteProduct(id) {
    if (!confirm("Delete this product? ❌")) return;

    fetch(`${BASE_URL}/delete-product/${id}`, {
        method: "DELETE",
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                alert("Product deleted ✅");
                loadProducts();
            }
        })
        .catch((err) => console.error(err));
}

// ===== LOAD ALL ORDERS (ADMIN) =====
function loadOrdersAdmin() {
    fetch(`${BASE_URL}/admin/orders`)
        .then((res) => res.json())
        .then((data) => {
            const container = document.getElementById("adminOrders");
            if (!container) return;

            container.innerHTML = "";

            data.forEach((order) => {
                let productsHTML = "";

                if (order.items && Array.isArray(order.items)) {
                    order.items.forEach((item) => {
                        productsHTML += `
                            <div style="display:flex; gap:8px; margin-bottom:5px;">
                                <img src="${item.image || 'https://via.placeholder.com/40'}"
                                width="35">
                                <span>${item.name} × ${item.quantity}</span>
                            </div>
                        `;
                    });
                }

                const row = document.createElement("tr");

                row.innerHTML = `
                   <td>
                      <a href="order-details.html?id=${order.id}"
                         style=" 
                            color:#2563eb;
                            font-weight:600;
                            text-decoration:none;
                        ">
                         #${order.id}
                         </a>
                    </td>
                    <td>${order.name}</td>
                    <td>${order.phone}</td>
                    <td>${productsHTML}</td>
                    <td>$${order.total}</td>
                    <td>${order.payment}</td>
                    <td>
                        <select onchange="updateStatus(${order.id}, this.value)">
                            <option ${order.status === "Processing" ? "selected" : ""}>Processing</option>
                            <option ${order.status === "Shipped" ? "selected" : ""}>Shipped</option>
                            <option ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
                        </select>
                    </td>
                    <td>
                        <button onclick="deleteOrderAdmin(${order.id})">Delete</button>
                    </td>
                `;

                container.appendChild(row);
            });
        })
        .catch((err) => console.error(err));
}

// ===== UPDATE STATUS =====
function updateStatus(orderId, status) {
    fetch(`${BASE_URL}/admin/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, status }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                alert("Status Updated ✅");
            }
        })
        .catch((err) => console.error(err));
}

// ===== DELETE ORDER =====
function deleteOrderAdmin(orderId) {
    if (!confirm("Delete this order? ❌")) return;

    fetch(`${BASE_URL}/order/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                alert("Order Deleted ✅");
                loadOrdersAdmin();
            }
        })
        .catch((err) => console.error(err));
}

// ===== USER LETTER =====
document.addEventListener("DOMContentLoaded", function () {
    const user_id = localStorage.getItem("user_id");
    const usernameEl = document.getElementById("username");

    if (!user_id || !usernameEl) return;

    fetch(`${BASE_URL}/user/${user_id}`)
        .then((res) => res.json())
        .then((user) => {
            if (user?.name) {
                usernameEl.innerText = user.name.charAt(0).toUpperCase();
            }
        })
        .catch((err) => console.error(err));
});

// ===== LOAD DATA =====
document.addEventListener("DOMContentLoaded", function () {
    loadProducts();
    loadOrdersAdmin();
});