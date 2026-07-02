const API_URL = "http://localhost:8080";

let currentUser = null;
let allStudentsCache = [];
let deleteTargetId = null;
let isLogoutMode = false;

window.onload = function() {
    const storedUser = localStorage.getItem("currentUser");
    const storedRole = localStorage.getItem("currentRole");

    if (!storedUser || storedRole !== "staff") {
        // Not authenticated or wrong role
        window.location.href = "staff-login.html";
        return;
    }

    currentUser = JSON.parse(storedUser);
    
    // Populate sidebar and header details
    document.getElementById("logged-staff-name").innerText = currentUser.name;
    document.getElementById("logged-staff-dept").innerText = currentUser.department;
    document.getElementById("logged-staff-name-top").innerText = currentUser.name;

    // Load main dashboard summary stats by default
    switchStaffSubView("subview-dash");

    // Connection checks
    checkConnection();
    setInterval(checkConnection, 10000);
};

// Monitor API connection
function checkConnection() {
    fetch(`${API_URL}/students`)
        .then(() => updateApiBadge(true))
        .catch(() => updateApiBadge(false));
}

function updateApiBadge(isOnline) {
    const badge = document.getElementById("apiStatusBadge");
    const dot = badge.querySelector(".status-dot");
    const text = badge.querySelector(".status-text");
    
    if (isOnline) {
        badge.className = "connection-status connected";
        text.innerText = "Connected";
    } else {
        badge.className = "connection-status disconnected";
        text.innerText = "API Offline";
    }
}

// Trigger Logout Confirmation Dialog
function triggerLogoutConfirm() {
    isLogoutMode = true;
    
    const title = document.getElementById("confirmModalTitle");
    const text = document.getElementById("confirmModalText");
    const btn = document.getElementById("confirmActionBtn");
    
    title.innerText = "Do you want to logout?";
    text.innerText = "This will clear your active session and return you to the home selection screen.";
    
    btn.onclick = function() {
        executeLogout();
    };
    
    const modal = document.getElementById("confirmModal");
    modal.classList.add("active");
}

function executeLogout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentRole");
    window.location.href = "index.html";
}

// =========================================================================
// SUBVIEW SWITCHER
// =========================================================================
function switchStaffSubView(subviewId) {
    const subviews = document.querySelectorAll(".staff-subview");
    subviews.forEach(sv => sv.classList.remove("active-subview"));

    const target = document.getElementById(subviewId);
    if (target) {
        target.classList.add("active-subview");
    }

    // Toggle active sidebar highlight
    const navItems = document.querySelectorAll(".nav-menu .nav-item");
    navItems.forEach(item => item.classList.remove("active"));

    const shortId = subviewId.replace("subview-", "");
    const navItem = document.getElementById(`nav-${shortId}`);
    if (navItem) {
        navItem.classList.add("active");
    }

    switch(shortId) {
        case 'dash':
            loadDashboardStats();
            break;
        case 'add':
            clearAddForm();
            break;
        case 'view':
            loadDirectoryList();
            break;
        case 'update':
            loadUpdateStudentList();
            break;
        case 'delete':
            loadDeletePageView();
            break;
        case 'search':
            loadSearchPageView();
            break;
        case 'staff-details':
            loadStaffDetailsView();
            break;
    }
}

// =========================================================================
// SUBVIEW ACTIONS
// =========================================================================

// Stats loader
function loadDashboardStats() {
    fetch(`${API_URL}/students`)
        .then(res => res.json())
        .then(students => {
            allStudentsCache = students;
            document.getElementById("count-total-students").innerText = students.length + " Students";
            
            const depts = new Set(students.map(s => s.department.trim().toUpperCase()).filter(d => d !== ""));
            document.getElementById("count-total-depts").innerText = depts.size;
        })
        .catch(() => {
            showToast("Failed to fetch dashboard statistics", "danger");
        });
}

// Add Student Form Submit
function handleAddStudentSubmit() {
    const student = {
        studentId: document.getElementById("add-stud-id").value.trim(),
        name: document.getElementById("add-stud-name").value.trim(),
        email: document.getElementById("add-stud-email").value.trim(),
        password: document.getElementById("add-stud-password").value || "Pass123!",
        department: document.getElementById("add-stud-dept").value.trim(),
        contactNumber: document.getElementById("add-stud-contact").value.trim(),
        address: document.getElementById("add-stud-address").value.trim()
    };

    fetch(`${API_URL}/students`, {
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
        showToast(`Student ${data.name} added successfully!`, "success");
        clearAddForm();
        switchStaffSubView("subview-view");
    })
    .catch(error => {
        showToast(error.message || "Failed to add student. ID or email already taken.", "danger");
    });
}

function clearAddForm() {
    document.getElementById("addStudentForm").reset();
}

// Load Student directory table
function loadDirectoryList() {
    fetch(`${API_URL}/students`)
        .then(res => res.json())
        .then(students => {
            allStudentsCache = students;
            renderDirectoryTable();
        })
        .catch(() => {
            showToast("Failed to fetch student directory", "danger");
        });
}

function renderDirectoryTable() {
    const tbody = document.getElementById("directoryTableBody");
    const empty = document.getElementById("directoryEmptyState");
    const table = document.getElementById("directoryTable");

    if (allStudentsCache.length === 0) {
        tbody.innerHTML = "";
        table.style.display = "none";
        empty.style.display = "flex";
        return;
    }

    table.style.display = "table";
    empty.style.display = "none";

    let rows = "";
    allStudentsCache.forEach(student => {
        rows += `
            <tr id="dir-row-${student.id}">
                <td><span class="badge badge-id">#${student.studentId}</span></td>
                <td>
                    <div class="user-info">
                        <span class="user-name">${escapeHTML(student.name)}</span>
                        <span class="user-subtext">${escapeHTML(student.email)}</span>
                    </div>
                </td>
                <td><span class="badge badge-dept">${escapeHTML(student.department)}</span></td>
                <td>${escapeHTML(student.contactNumber)}</td>
                <td><span style="font-size:0.82rem; color:var(--text-muted);">${escapeHTML(student.address)}</span></td>
            </tr>
        `;
    });
    tbody.innerHTML = rows;
}

// =========================================================================
// UPDATE STUDENT SUBVIEW CONTROLLER
// =========================================================================
function loadUpdateStudentList() {
    // Hide Form, Show List
    document.getElementById("update-list-container").style.display = "block";
    document.getElementById("update-form-container").style.display = "none";
    
    fetch(`${API_URL}/students`)
        .then(res => res.json())
        .then(students => {
            allStudentsCache = students;
            const tbody = document.getElementById("updateStudentListTableBody");
            
            if (students.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-muted);">No student records found.</td></tr>`;
                return;
            }

            let rows = "";
            students.forEach(student => {
                rows += `
                    <tr>
                        <td><span class="badge badge-id">#${student.studentId}</span></td>
                        <td><strong>${escapeHTML(student.name)}</strong></td>
                        <td><span class="badge badge-dept">${escapeHTML(student.department)}</span></td>
                        <td>
                            <button class="btn btn-secondary btn-sm" onclick="editStudentForm(${student.id})">
                                <i class="fa-regular fa-pen-to-square"></i> Edit
                            </button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = rows;
        })
        .catch(() => {
            showToast("Failed to fetch students list for update view", "danger");
        });
}

function editStudentForm(idPk) {
    const student = allStudentsCache.find(s => s.id === idPk);
    if (!student) return;

    // Show form, hide table list
    document.getElementById("update-list-container").style.display = "none";
    document.getElementById("update-form-container").style.display = "block";

    // Fill form details
    document.getElementById("update-stud-id-pk").value = student.id;
    document.getElementById("update-stud-id").value = student.studentId;
    document.getElementById("update-stud-name").value = student.name;
    document.getElementById("update-stud-email").value = student.email;
    document.getElementById("update-stud-dept").value = student.department;
    document.getElementById("update-stud-contact").value = student.contactNumber;
    document.getElementById("update-stud-address").value = student.address;
    document.getElementById("update-stud-password").value = "";

    document.getElementById("update-form-subtitle").innerText = `Modifying profile parameters for Student ID #${student.studentId}`;
}

function handleUpdateStudentSubmit() {
    const pkId = document.getElementById("update-stud-id-pk").value;
    const student = {
        studentId: document.getElementById("update-stud-id").value.trim(),
        name: document.getElementById("update-stud-name").value.trim(),
        email: document.getElementById("update-stud-email").value.trim(),
        department: document.getElementById("update-stud-dept").value.trim(),
        contactNumber: document.getElementById("update-stud-contact").value.trim(),
        address: document.getElementById("update-stud-address").value.trim()
    };
    
    const pw = document.getElementById("update-stud-password").value;
    if (pw) {
        student.password = pw;
    }

    fetch(`${API_URL}/students/${pkId}`, {
        method: "PUT",
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
        showToast("Student profile updated successfully!", "success");
        cancelUpdate();
        switchStaffSubView("subview-update");
    })
    .catch(error => {
        showToast(error.message || "Failed to update profile. ID or Email already exists.", "danger");
    });
}

function cancelUpdate() {
    document.getElementById("updateStudentForm").reset();
    document.getElementById("update-list-container").style.display = "block";
    document.getElementById("update-form-container").style.display = "none";
}

// =========================================================================
// DELETE STUDENT SUBVIEW CONTROLLER
// =========================================================================
function loadDeletePageView() {
    fetch(`${API_URL}/students`)
        .then(res => res.json())
        .then(students => {
            allStudentsCache = students;
            const tbody = document.getElementById("deleteSearchTableBody");
            
            if (students.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-muted);">No student records found.</td></tr>`;
            } else {
                let rows = "";
                students.forEach(student => {
                    rows += `
                        <tr>
                            <td><span class="badge badge-id">#${student.studentId}</span></td>
                            <td><strong>${escapeHTML(student.name)}</strong></td>
                            <td><span class="badge badge-dept">${escapeHTML(student.department)}</span></td>
                            <td>
                                <button class="icon-btn delete" onclick="triggerDelete(${student.id})">
                                    <i class="fa-regular fa-trash-can"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `;
                });
                tbody.innerHTML = rows;
            }
            renderRecentlyDeleted();
        })
        .catch(() => {
            showToast("Failed to fetch students for deletion list", "danger");
        });
}

function triggerDelete(id) {
    isLogoutMode = false;
    deleteTargetId = id;
    
    const title = document.getElementById("confirmModalTitle");
    const text = document.getElementById("confirmModalText");
    const btn = document.getElementById("confirmActionBtn");
    
    title.innerText = "Are you sure you want to delete this student?";
    text.innerText = "This student record will be permanently deleted from the registry database.";
    
    btn.onclick = function() {
        confirmDelete();
    };
    
    const modal = document.getElementById("confirmModal");
    modal.classList.add("active");
}

function closeConfirmModal() {
    const modal = document.getElementById("confirmModal");
    modal.classList.remove("active");
    deleteTargetId = null;
}

function confirmDelete() {
    if (!deleteTargetId) return;

    const studentToDelete = allStudentsCache.find(s => s.id === deleteTargetId);

    fetch(`${API_URL}/students/${deleteTargetId}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) throw new Error("Delete failed");
        
        showToast("Student deleted successfully", "success");
        closeConfirmModal();
        
        // Track recently deleted logs
        if (studentToDelete) {
            logDeletedStudent(studentToDelete);
        }

        loadDeletePageView();
    })
    .catch(() => {
        showToast("Failed to delete record", "danger");
        closeConfirmModal();
    });
}

// Log deleted records
function logDeletedStudent(student) {
    let logs = JSON.parse(localStorage.getItem("recentlyDeletedLogs") || "[]");
    
    const record = {
        studentId: student.studentId,
        deletedBy: currentUser.name,
        time: formatDateTime(new Date())
    };

    logs.unshift(record); // Prepend log
    if (logs.length > 5) {
        logs.pop(); // Keep list short
    }

    localStorage.setItem("recentlyDeletedLogs", JSON.stringify(logs));
    renderRecentlyDeleted();
}

function renderRecentlyDeleted() {
    const container = document.getElementById("recentlyDeletedList");
    const logs = JSON.parse(localStorage.getItem("recentlyDeletedLogs") || "[]");

    if (logs.length === 0) {
        container.innerHTML = `<div style="color:var(--text-muted); font-size:0.85rem;">No recently deleted students in this session.</div>`;
        return;
    }

    let html = "";
    logs.forEach(log => {
        html += `
            <div class="delete-log-card">
                <div><span>Student ID :</span> ${escapeHTML(log.studentId)}</div>
                <div><span>Deleted By :</span> ${escapeHTML(log.deletedBy)}</div>
                <div><span>Deleted Time :</span> ${log.time}</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// =========================================================================
// SEARCH STUDENT SUBVIEW CONTROLLER
// =========================================================================
function loadSearchPageView() {
    document.getElementById("searchPageViewInput").value = "";
    document.getElementById("searchResultsTable").style.display = "none";
    document.getElementById("searchEmptyState").style.display = "flex";
}

function handleSearchPageView() {
    const query = document.getElementById("searchPageViewInput").value.trim();
    const table = document.getElementById("searchResultsTable");
    const emptyState = document.getElementById("searchEmptyState");
    const tbody = document.getElementById("searchResultsTableBody");

    if (query.length === 0) {
        table.style.display = "none";
        emptyState.style.display = "flex";
        tbody.innerHTML = "";
        return;
    }

    fetch(`${API_URL}/students/search?query=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(students => {
            if (students.length === 0) {
                table.style.display = "none";
                emptyState.style.display = "flex";
                emptyState.querySelector("h3").innerText = "No Records Found";
                emptyState.querySelector("p").innerText = "No student matches that ID or Name.";
                return;
            }

            table.style.display = "table";
            emptyState.style.display = "none";

            let rows = "";
            students.forEach(student => {
                rows += `
                    <tr>
                        <td><span class="badge badge-id">#${student.studentId}</span></td>
                        <td><strong class="user-name">${escapeHTML(student.name)}</strong></td>
                        <td>${escapeHTML(student.email)}</td>
                        <td><span class="badge badge-dept">${escapeHTML(student.department)}</span></td>
                        <td>${escapeHTML(student.contactNumber)}</td>
                        <td>${escapeHTML(student.address)}</td>
                    </tr>
                `;
            });
            tbody.innerHTML = rows;
        })
        .catch(err => {
            console.error("Search API error:", err);
        });
}

// =========================================================================
// STAFF DETAILS SUBVIEW CONTROLLER
// =========================================================================
function loadStaffDetailsView() {
    document.getElementById("staff-detail-name").innerText = currentUser.name;
    document.getElementById("staff-detail-id").innerText = currentUser.staffId;
    document.getElementById("staff-detail-email").innerText = currentUser.email;
    document.getElementById("staff-detail-dept").innerText = currentUser.department;
    document.getElementById("staff-detail-contact").innerText = currentUser.contactNumber;
    document.getElementById("staff-detail-address").innerText = currentUser.address;
}

// =========================================================================
// UTILITIES: TOASTS, DATE FORMATTING, AND SANITIZATION
// =========================================================================
function formatDateTime(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hoursStr = String(hours).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hoursStr}:${minutes} ${ampm}`;
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
