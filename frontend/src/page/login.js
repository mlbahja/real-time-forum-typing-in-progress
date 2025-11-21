import { fetchLogin, fetchRegister } from "../api/auth.js";
import { router } from "../app.js";
import { displayToast } from "../components/toast.js";
import { initAuth, states } from "../states.js";
import { createDom } from "../utils/createDom.js";

function logintTemplate() {
  return createDom(`
    <div class="source">
    <div class="containerr" id="containerr">
        <div id="signUpModal" class="form-container sign-up">
            <form  method="POST" class="register-form">
                <h1>Create Account</h1>
                <input type="text" id="signup-username" name="username" placeholder="Enter your nickname" required>
                <input type="text" id="first-name" name="firstname" placeholder="Enter your first name" required>
                <input type="text" id="last-name" name="lastname" placeholder="Enter your last name" required>
                <input type="number" id="age" name="age" placeholder="Enter your age" min="1" required>
                <select id="gender" name="gender" required>
                    <option value="" disabled selected>Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <input type="email" id="signup-email" name="email" placeholder="Enter your email" required>
                <input type="password" id="signup-password" name="password" placeholder="Enter your password" required>
                <input type="password" id="signup-confirm-password" name="confirm-password" placeholder="Confirm your password" required>
                <button class="logup">Sign Up</button>
            </form>
        </div>
        <div id="loginModal" class="form-container sign-in">
            <form method="POST" class="login-form">
                <h1>Sign In</h1>
                <input type="text" id="login-username" name="username" placeholder="Enter your username" autocomplete="off" required>
                <input type="password" id="login-password" name="password" placeholder="Enter your password" required>
                <button class="logup" type="submit">Sign In</button>
            </form>
        </div>
        <div class="toggle-container">
            <div class="toggle">
                <div class="toggle-pannel toggle-left">
                    <h1>Welcome Back!</h1>
                    <p>Enter your personal details to use all of site features</p>
                    <button class="logup" id="login">Sign In</button>
                </div>
                <div class="toggle-pannel toggle-right">
                    <h1>Hello, Friend!</h1>
                    <p>Register with your personal details to use all of site features</p>
                    <button class="logup" id="register">Sign Up</button>
                </div>
            </div>
        </div>
    </div>
</div>`);
}

export function LoginPage() {
  const dom = logintTemplate();
  const loginFormElement = dom.querySelector(".login-form");
  const registerFormElement = dom.querySelector(".register-form");
  const container = dom.getElementById("containerr");
  const registerBtn = dom.getElementById("register");
  const loginBtn = dom.getElementById("login");

  if (states.isAuth) {
    router.navigate("/");
    return;
  }
  // check if is logged in
  registerBtn.addEventListener("click", () => {
    container.classList.add("active");
  });
  loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
  });
  loginFormElement.addEventListener("submit", onLoginSubmit);
  registerFormElement.addEventListener("submit", onRegisterSubmit);
  return dom;
}

async function onLoginSubmit(e) {
  e.preventDefault();
  try {
    const formData = new FormData(e.currentTarget);
    const data = await fetchLogin(formData);
    displayToast("Logedin successfully!", "success")
    await initAuth();
    router.redirect("/", 2000);
  } catch (error) {
    displayToast(error.message, "error");
  }
}

async function onRegisterSubmit(e) {
  e.preventDefault();

  try {
    const formData = new FormData(e.currentTarget);
    const data = await fetchRegister(formData);
    displayToast("Registered successfully!", "success");
    router.redirect("/login", 2000);
  } catch (error) {
    displayToast(error.message, "error");
  }
}
