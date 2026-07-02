const API_URL = "http://localhost:8080";

function handleStaffRegister() {
    const staff = {
        staffId: document.getElementById("reg-staff-id").value.trim(),
        name: document.getElementById("reg-staff-name").value.trim(),
        email: document.getElementById("reg-staff-email").value.trim(),
        password: document.getElementById("reg-staff-password").value,
        department: document.getElementById("reg-staff-dept").value.trim(),
        contactNumber: document.getElementById("reg-staff-contact").value.trim(),
        address: document.getElementById("reg-staff-address").value.trim()
    };

    fetch(`${API_URL}/staff/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staff)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        showToast("Staff registered successfully! Redirecting to Login...", "success");
        setTimeout(() => {
            window.location.href = "staff-login.html";
        }, 1500);
    })
    .catch(error => {
        console.error(error);
        showToast(error.message || "Registration failed. Check if Staff ID or Email is taken.", "danger");
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
