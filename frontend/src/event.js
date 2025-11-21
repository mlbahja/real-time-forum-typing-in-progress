export function emitPostCreatedEvent(postData) {
  const event = new CustomEvent("postCreated", { detail: postData });
  document.dispatchEvent(event);
}
