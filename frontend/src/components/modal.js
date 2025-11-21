const modalContainer = document.querySelector(".modal-container");
const modalBody = modalContainer.querySelector(".modal-body");
const closeBtn = modalContainer.querySelector(".close");
const modalTitle = modalContainer.querySelector(".modal-title");

function emptyModal() {
  modalBody.innerHTML = "";
  modalTitle.textContent = "";
}

closeBtn.addEventListener("click", () => {
  modalContainer.classList.add("hidden");
  emptyModal();
});

export function setModalContent(title, dom) {
  modalBody.innerHTML = "";
  modalTitle.textContent = title;
  modalContainer.classList.remove("hidden");
  modalBody.append(dom);
}

export function closeModal() {
  modalContainer.classList.add("hidden");
  emptyModal();
}
