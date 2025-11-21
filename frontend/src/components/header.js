import { states } from "../states.js";
import { createDom } from "../utils/createDom.js";
import { logoutModal } from "./logoutModal.js";
import { setModalContent } from "./modal.js";

function headerTemplate() {
  return createDom(`<header class="navbar">
        <div class="container">
            <div class="nav-left">
                <img src="static/src/logo.png" alt="logo" class="logo" />
            </div>
            <nav class="navbar-right">
                <div class="nav-user-icon online menu-toggle">
                    <img src="static/src/Unknown_person.jpg" alt="profile" />
                </div>
                <!-- settings-menu -->
                <div class="settings-menu">
                    <div class="setting-menu-inner">
                        <div class="user-profile">
                            <img src="static/src/Unknown_person.jpg" alt="profile" />
                            <div>
                                <p>${states.user.username}</p>
                            </div>
                        </div>
                        <hr>
                        <div class="theme-toggle">
                            <span class="theme-label">Theme</span>
                            <label class="switch">
                                <input type="checkbox" id="theme-switch">
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <hr>
                        <div class="nav-actions">
                            <button id="logoutt" class="btn logout">Logout</button>
                        </div>
                        <hr>
                    </div>
                </div>
        </div>
    </header>`);
}

export function Header() {
  const dom = headerTemplate();

  const settingsmenu = dom.querySelector(".settings-menu");
  const darkBtn = dom.getElementById("dark-theme");
  const themeSwitch = dom.querySelector("#theme-switch");
  const menuToggleEl = dom.querySelector(".menu-toggle");
  const logout = dom.querySelector(".logout");

  menuToggleEl.addEventListener("click", settingsMenuToggle);
  themeSwitch.addEventListener("click", onThemeSwitch);
  logout.addEventListener("click", onLogout);

  function settingsMenuToggle() {
    settingsmenu.classList.toggle("settings-menu-height");
  }

  function onThemeSwitch() {
    themeSwitch.classList.toggle("dark-on");
    document.body.classList.toggle("dark");

    if (localStorage.getItem("theme") == "light") {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  }

  function onLogout() {
    // console.log("logout");
    menuToggleEl.click();
    setModalContent("logout", logoutModal());
  }

  if (localStorage.getItem("theme") == "light") {
    themeSwitch.classList.remove("dark-on");
    document.body.classList.remove("dark");
  } else if (localStorage.getItem("theme") == "dark") {
    themeSwitch.classList.add("dark-on");
    document.body.classList.add("dark");
  } else {
    localStorage.setItem("theme", "light");
  }

  return dom;
}
