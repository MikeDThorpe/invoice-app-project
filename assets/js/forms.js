const userSignUpForm = document.getElementById("user-signup-form");
userSignUpForm.addEventListener("submit", async (event) => {
  // check if both passwords are correct
  if (event.target.password.value !== event.target.confirmPassword.value) {
    event.preventDefault();
    document.getElementById("user-signup-form-error").textContent = "Passwords do not match.";
    return;
  }
  document.getElementById("user-signup-form-error").textContent = "";
});
