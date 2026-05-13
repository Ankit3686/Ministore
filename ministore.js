// ===== BASE URL =====
const BASE_URL =
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
        ? "http://localhost:5000"
        : "https://ministore-phdo.onrender.com"; // 👈 deploy ke baad change

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    setupUserLetter();
    setupAdminLink();
    setupDropdown();
    setupSliderControls();
    setupScrollNav();
});

// ===== NAV MENU =====
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

// =======================
// SLIDER SYSTEM
// =======================

let slideIndex = 0;
let blogIndex = 0;

function setupSliderControls() {
    window.nextSlide = () => changeSlide(1);
    window.prevSlide = () => changeSlide(-1);
    window.nextBlog = () => changeBlog(1);
    window.prevBlog = () => changeBlog(-1);
}

function changeSlide(step) {
    const slides = document.querySelectorAll(".slide");
    if (!slides.length) return;

    slides[slideIndex].classList.remove("active");

    slideIndex = (slideIndex + step + slides.length) % slides.length;

    slides[slideIndex].classList.add("active");
}

function changeBlog(step) {
    const blogs = document.querySelectorAll(".blog-slide");
    if (!blogs.length) return;

    blogs[blogIndex].classList.remove("active");

    blogIndex = (blogIndex + step + blogs.length) % blogs.length;

    blogs[blogIndex].classList.add("active");
}

// =======================
// NAV ACTIVE ON SCROLL
// =======================
function setupScrollNav() {
    window.addEventListener("scroll", () => {
        const sections = [
            { id: "home", link: "homeLink" },
            { id: "services", link: "serviceLink" },
            { id: "products", link: "productLink" },
            { id: "watch", link: "watchLink" },
            { id: "sale", link: "saleLink" },
            { id: "blog", link: "blogLink" }
        ];

        const scrollPos = window.scrollY + 150;

        sections.forEach(sec => {
            const sectionEl = document.getElementById(sec.id);
            const linkEl = document.getElementById(sec.link);

            if (!sectionEl || !linkEl) return;

            const top = sectionEl.offsetTop;
            const bottom = top + sectionEl.offsetHeight;

            if (scrollPos >= top && scrollPos < bottom) {
                document.querySelectorAll(".nav-link")
                    .forEach(l => l.classList.remove("active"));

                linkEl.classList.add("active");
            }
        });
    });
}

// =======================
// PRODUCTS
// =======================
function loadProducts() {
    fetch(`${BASE_URL}/products`)
        .then(res => res.json())
        .then(renderProducts)
        .catch(err => console.error("Product error:", err));
}

function renderProducts(data) {
    const productContainer = document.getElementById("productsContainer");
    const watchContainer = document.getElementById("watchContainer");

    if (!productContainer || !watchContainer) return;

    productContainer.innerHTML = "";
    watchContainer.innerHTML = "";

    data.forEach(product => {
        const card = createProductCard(product);

        if (product.type === "Phones") {
            productContainer.appendChild(card);
        } else {
            watchContainer.appendChild(card);
        }
    });

    attachCartEvents();
}

function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
        <div class="img-box">
            <img src="${product.image}"
                onerror="this.src='https://via.placeholder.com/150'">

            <button class="cart-btn" data-id="${product.id}">
                Add To Cart
            </button>
        </div>

        <div class="product-info">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
        </div>
    `;

    return card;
}

// =======================
// CART
// =======================
function attachCartEvents() {
    document.querySelectorAll(".cart-btn").forEach(btn => {
        btn.addEventListener("click", function () {

            const product_id = this.dataset.id;
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
                    alert(data.message || "Added to cart 🛒");
                })
                .catch(err => console.error("Cart error:", err));
        });
    });
}

// =======================
// USER LETTER
// =======================
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
        .catch(err => console.error("User error:", err));
}

// =======================
// ADMIN LINK
// =======================
function setupAdminLink() {
    const adminEmail = "kumar22102001ankit@gmail.com";
    const currentEmail = localStorage.getItem("loggedInEmail");
    const adminEl = document.getElementById("adminLink");

    if (adminEl) {
        adminEl.style.display =
            currentEmail === adminEmail ? "inline-block" : "none";
    }
}