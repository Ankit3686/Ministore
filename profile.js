// ===== BASE URL =====
const BASE_URL =
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
        ? "http://localhost:5000"
        : "https://ministore-phdo.onrender.com"; // 👈 deploy ke baad change

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
        window.location.href = "login.html";
        return;
    }

    loadProfile(user_id);
    setupImageUpload();
    setupDropdown();
    setupAdminLink();
});

// ===== LOAD PROFILE =====
function loadProfile(user_id) {
    fetch(`${BASE_URL}/user/${user_id}`)
        .then(res => res.json())
        .then(user => {
            if (!user) return;

            setUserLetter(user);
            setProfileData(user);
            setProfileImage(user);
        })
        .catch(err => console.error("Profile error:", err));
}

// ===== USER LETTER =====
function setUserLetter(user) {
    const usernameEl = document.getElementById("username");
    if (!usernameEl) return;

    const name = user.name || "User";
    usernameEl.innerText = name.charAt(0).toUpperCase();
}

// ===== PROFILE DATA =====
function setProfileData(user) {
    document.getElementById("profileName").innerText = user.name || "User";
    document.getElementById("profileEmail").innerText = user.email || "-";

    const accountType = document.getElementById("accountType");
    if (accountType) {
        accountType.innerText =
            user.email === "kumar22102001ankit@gmail.com"
                ? "Admin"
                : "User";
    }
}

// ===== PROFILE IMAGE =====
function setProfileImage(user) {
    const img = document.getElementById("profileImage");
    if (!img) return;

    const DEFAULT_IMAGE =
        "https://res.cloudinary.com/your-cloud/image/upload/v123/default-profile.png";

    img.src = user.image || DEFAULT_IMAGE;

    img.onerror = function () {
        this.onerror = null;
        this.src = DEFAULT_IMAGE;
    };
}

// ===== IMAGE UPLOAD =====
function setupImageUpload() {
    const input = document.getElementById("imageUpload");

    if (!input) return;

    input.addEventListener("change", async function () {

        const file = this.files[0];

        if (!file) return;

        const user_id = localStorage.getItem("user_id");

        const formData = new FormData();
        formData.append("image", file);

        try {

            const response = await fetch(
                `${BASE_URL}/upload-profile/${user_id}`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (data.success) {

                document.getElementById("profileImage").src =
                    data.image + "?t=" + Date.now();

                alert("Profile updated ✅");

            } else {

                alert(data.message || "Upload failed ❌");

            }

        } catch (err) {

            console.error("Upload error:", err);
            alert("Server error ❌");

        }

    });
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

// ===== MENU =====
function toggleMenu() {
    document.getElementById("nav").classList.toggle("show");
}

// ===== LOGOUT =====
function logout() {
    localStorage.clear();
    alert("Logged Out ✅");
    window.location.href = "login.html";
}