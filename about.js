const BASE_URL =
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
        ? "http://localhost:5000"
        : "https://ministore-1.onrender.com"; 
// ===== MENU =====
function toggleMenu() {
    document.getElementById("nav")?.classList.toggle("show");
}

// ===== MOBILE DROPDOWN =====
document.addEventListener("DOMContentLoaded", () => {

    const dropdown = document.querySelector(".dropdown");

    if (dropdown) {
        const dropdownLink = dropdown.querySelector("a");

        dropdownLink?.addEventListener("click", (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle("active");
            }
        });
    }
});


// ===== BLOG SLIDER =====
let blogSlides = [];

document.addEventListener("DOMContentLoaded", () => {
    blogSlides = document.querySelectorAll(".blog-slide");
});

let blogIndex = 0;

function showBlogSlide(i) {
    if (!blogSlides.length) return;

    blogSlides.forEach(slide => slide.classList.remove("active"));
    blogSlides[i]?.classList.add("active");
}

function nextBlog() {
    if (!blogSlides.length) return;

    blogIndex = (blogIndex + 1) % blogSlides.length;
    showBlogSlide(blogIndex);
}

function prevBlog() {
    if (!blogSlides.length) return;

    blogIndex = (blogIndex - 1 + blogSlides.length) % blogSlides.length;
    showBlogSlide(blogIndex);
}


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
            if (!user) return;

            const name = user.name || "User";
            usernameEl.innerText = name.charAt(0).toUpperCase();
        })
        .catch(err => {
            console.error("User fetch error:", err);
        });
});
