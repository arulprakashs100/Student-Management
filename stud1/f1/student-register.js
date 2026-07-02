const API_URL = "http://localhost:8080";

function handleStudentRegister() {
    const student = {
        studentId: document.getElementById("reg-stud-id").value.trim(),
        name: document.getElementById("reg-stud-name").value.trim(),
        email: document.getElementById("reg-stud-email").value.trim(),
        password: document.getElementById("reg-stud-password").value,
        department: document.getElementById("reg-stud-dept").value.trim(),
        contactNumber: document.getElementById("reg-stud-contact").value.trim(),
        address: document.getElementById("reg-stud-address").value.trim()
    };

    fetch(`${API_URL}/students/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        showToast("Student registered successfully! Redirecting to Login...", "success");
        setTimeout(() => {
            window.location.href = "student-login.html";
        }, 1500);
    })
    .catch(error => {
        console.error(error);
        showToast(error.message || "Registration failed. Check if Student ID or Email is taken.", "danger");
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
