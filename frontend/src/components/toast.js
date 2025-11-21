import { toastContainer } from "../app.js";
import { createDom } from "../utils/createDom.js";

function toastTemplate(message, type) {
  return createDom(`<div class="toast ${type}">${message}</div>`, false);
}

export function displayToast(message, type) {
  const dom = toastTemplate(message, type);
  const toastEl = dom.querySelector('.toast');
  let timer;

  const hideToast = (delay) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      toastEl.remove();
    }, delay);
  };
  hideToast(2000);
  toastEl.addEventListener("mouseenter", () => {
    clearTimeout(timer);
  });
  toastEl.addEventListener("mouseleave", () => hideToast(2000));
  toastContainer.append(dom);
}
