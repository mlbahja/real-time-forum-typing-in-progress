import { IndexPage } from "./page/index.js";
import { LoginPage } from "./page/login.js";
import { Router } from "./router.js";
import { initAuth, states } from "./states.js";
import { waitForDOM } from "./utils/waitForDOM.js";

const root = document.getElementById("root");
export const toastContainer = document.querySelector(".toast-container");

root.innerHTML = "";

const routes = {
  "/login": LoginPage,
  "/": IndexPage,
};

export const router = Router(routes, root);
async function App() {
  await initAuth();
  if (states.isAuth) {
    router.navigate("/");
    waitForDOM();
  } else {
    router.navigate("/login");
  }
}

App();
