window.onload = function() {
    const storedUser = localStorage.getItem("currentUser");
    const storedRole = localStorage.getItem("currentRole");

    if (!storedUser || storedRole !== "student") {
        // Not authenticated or wrong role
        window.location.href = "student-login.html";
        return;
    }

    const currentUser = JSON.parse(storedUser);
    
    // Populate profile details
    document.getElementById("profile-card-name").innerText = currentUser.name;
    document.getElementById("profile-val-id").innerText = currentUser.studentId;
    document.getElementById("profile-val-email").innerText = currentUser.email;
    document.getElementById("profile-val-dept").innerText = currentUser.department;
    document.getElementById("profile-val-contact").innerText = currentUser.contactNumber;
    document.getElementById("profile-val-address").innerText = currentUser.address;
};

function logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentRole");
    window.location.href = "index.html";
}
