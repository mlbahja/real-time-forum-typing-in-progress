import { createDom } from "../utils/createDom.js";

function loaderTemplate() {
  return createDom(`<div class="spinner"></div>`);
}

export function Loader() {
  return loaderTemplate();
}
