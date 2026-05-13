// ===== BASE URL =====
const BASE_URL =
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
        ? "http://localhost:5000"
        : "https://ministore-1.onrender.com";

// ===== NAV MENU =====
function toggleMenu() {
    document.getElementById("nav")?.classList.toggle("show");
}

// ===== INIT ALL =====
document.addEventListener("DOMContentLoaded", () => {

    // ===== ADMIN SECURITY =====
    const adminEmail = "kumar22102001ankit@gmail.com";
    const currentEmail = localStorage.getItem("loggedInEmail");

    if (currentEmail !== adminEmail) {

        alert("Access Denied ❌");

        window.location.href = "login.html";

        return;
    }

    setupDropdown();
    setupUser();
    setupAdmin();
    loadOrderDetails();
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
            currentEmail === adminEmail
                ? "inline-block"
                : "none";
    }
}

// ===== LOAD ORDER DETAILS =====
function loadOrderDetails() {

    const params = new URLSearchParams(window.location.search);

    const orderId = params.get("id");

    if (!orderId) {

        alert("Order ID Missing ❌");

        return;
    }

    fetch(`${BASE_URL}/order/${orderId}`)

        .then(async (res) => {

            const data = await res.json();

            console.log("ORDER DETAILS:", data);

            return data;
        })

        .then(renderOrder)

        .catch((err) => {

            console.log("ORDER ERROR:", err);

            alert("Order load failed ❌");
        });
}

// ===== RENDER ORDER =====
function renderOrder(order) {

    if (!order || !order.id) {

        console.log("INVALID ORDER:", order);

        return;
    }

    setText("invId", "#" + order.id);

    setText("invDate", order.date || "-");

    setText("invStatus", order.status || "Processing");

    setText("invUser", order.name || "-");

    setText("invPhone", order.phone || "-");

    setText("invAddress", order.address || "-");

    setText("invTotal", (order.total || 0).toFixed(2));

    // ===== PRODUCTS =====
    const container = document.getElementById("invProducts");

    if (!container) return;

    let items = [];

    // ===== SAFE ITEMS PARSE =====
    if (Array.isArray(order.items)) {

        items = order.items;

    } else if (typeof order.items === "string") {

        try {

            items = JSON.parse(order.items);

        } catch {

            items = [];
        }
    }

    if (items.length === 0) {

        container.innerHTML =
            "<tr><td colspan='3'>No Items Found</td></tr>";

        return;
    }

    container.innerHTML = items.map(item => {

        const name = item.name || "Item";

        const qty = item.quantity || 1;

        const price = item.price || 0;

        const img =
            item.image ||
            "https://via.placeholder.com/50";

        return `
        <tr>

            <td>
                <div style="
                    display:flex;
                    align-items:center;
                    gap:10px;
                ">

                    <img
                        src="${img}"
                        width="50"
                        height="50"

                        style="
                            border-radius:8px;
                            object-fit:cover;
                        "

                        onerror="
                            this.src='https://via.placeholder.com/50'
                        "
                    >

                    ${name}

                </div>
            </td>

            <td>${qty}</td>

            <td>$${price.toFixed(2)}</td>

        </tr>
        `;
    }).join("");
}

// ===== HELPER =====
function setText(id, value) {

    const el = document.getElementById(id);

    if (el) {

        el.innerText = value;
    }
}

// ===== BACK BUTTON =====
function goBack() {

    window.history.back();
}
