document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const logoutBtns = document.querySelectorAll(".logoutBtn");
  const loginLinks = document.querySelectorAll("a[href='login.html']");

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // Show/hide buttons based on login state
  if (isLoggedIn) {
    logoutBtns.forEach(btn => btn.style.display = "inline-block");
    loginLinks.forEach(link => link.style.display = "none");
  } else {
    logoutBtns.forEach(btn => btn.style.display = "none");
    loginLinks.forEach(link => link.style.display = "inline-block");
  }

  // Login form logic
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = loginForm.elements["first_name"].value.trim();
      const password = loginForm.elements["last_name"].value.trim();

      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      alert("Login successful!");
      location.href = "index.html"; // redirect
    });
  }

  // Logout logic
  logoutBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      localStorage.removeItem("isLoggedIn");
      alert("Logged out successfully.");
      location.reload();
    });
  });
});
