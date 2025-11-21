import { fetchLogout } from "../api/auth.js";
import { router } from "../app.js";
import { states } from "../states.js";
import { createDom } from "../utils/createDom.js";
import { closeModal } from "./modal.js";

function logoutTemplate() {
  return createDom(`
    <p>Are you sure you want to log out?</p>
    <div class="logout-actions">
        <button id="confirmLogout" class="btn_s confirm">Yes, Logout</button>
        <button id="cancelLogout" class="btn_s cancel-btn">Cancel</button>
    </div>
  `);
}

export function logoutModal() {
  const dom = logoutTemplate();
  const cancelBtn = dom.querySelector(".cancel-btn");
  const confirmBtn = dom.querySelector(".confirm");

  confirmBtn.addEventListener("click", onConfirmLogout);
  cancelBtn.addEventListener("click", onCancle);

  function onCancle() {
    closeModal();
  }

  async function onConfirmLogout() {
    await fetchLogout();
    closeModal();
    states.isAuth = false;
    states.user = {};
    router.navigate("/login");
  }

  return dom;
}
