export const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        loadMoreMessages();
    }
}, { root: chatContainer, threshold: 1.0 });