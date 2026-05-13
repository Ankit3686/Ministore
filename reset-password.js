// ===== BASE URL =====
const BASE_URL =
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
        ? "http://localhost:5000"
        : "https://ministore-1.onrender.com"; // 👈 deploy ke baad change

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
    setupResetPassword();
    setupDropdown();
    setupUserLetter();
    setupAdminLink();
});

// ===== RESET PASSWORD =====
function setupResetPassword() {
    const form = document.getElementById("resetForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const newPassword = document.getElementById("newPassword").value.trim();

        // ===== VALIDATION =====
        if (!email || !newPassword) {
            alert("Please fill all fields ❌");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password: newPassword
                })
            });

            const data = await res.json();

            if (data.success) {
                alert("Password Reset Successful ✅");
                window.location.href = "login.html";
            } else {
                alert(data.message || "Reset failed ❌");
            }

        } catch (err) {
            console.error("Reset error:", err);
            alert("Server error ❌");
        }
    });
}

// ===== MENU =====
function toggleMenu() {
    document.getElementById("nav")?.classList.toggle("show");
}

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
