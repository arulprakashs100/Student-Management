const API_URL = "http://localhost:8080";

function handleStudentLogin() {
    const email = document.getElementById("login-stud-email").value.trim();
    const password = document.getElementById("login-stud-password").value;

    fetch(`${API_URL}/students/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) throw new Error("Invalid credentials");
        return response.json();
    })
    .then(student => {
        localStorage.setItem("currentUser", JSON.stringify(student));
        localStorage.setItem("currentRole", "student");
        showToast("Login successful! Loading dashboard...", "success");
        setTimeout(() => {
            window.location.href = "student-dashboard.html";
        }, 1200);
    })
    .catch(error => {
        showToast("Login failed. Check your email and password.", "danger");
    });
}

function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    const icon = type === "success" 
        ? '<i class="fa-solid fa-circle-check"></i>' 
        : '<i class="fa-solid fa-triangle-exclamation"></i>';
        
    toast.innerHTML = `${icon}<span>${escapeHTML(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("dismissing");
        toast.addEventListener("animationend", () => {
            toast.remove();
        });
    }, 4000);
}

function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
