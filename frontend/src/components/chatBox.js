import { chatData, oldMessages } from "../api/chat.js";
import { sendMessage } from "../api/websocket.js";
import { createDom } from "../utils/createDom.js";
import { formatMessageDate } from "../utils/date.js";
import { throttle } from "../utils/throttle.js";
import {  chatopen } from "./users.js"; 

function chatTemplate(user) {
  return createDom(`
      <div class="chat-window">
        <div class="chat-header">
          <div class="chat-user-info"> 
            <img src="${
              user.profile_pic || "static/src/Unknown_person.jpg"
            }" alt="profile">
            <span>${user.Username}</span>
            <img src="static/src/typing.svg" id="typing" alt="typing..." />
          </div>
          <button class="close-button">×</button>
        </div>
        <div id="chat" data-username="${user.Username}">
          <div id="loader">Loading...</div>
          <div class="messages"></div>
        </div>
        <div class="chat-input">
          <input id="chat-input" type="text" placeholder="Start typing...">
        </div>
      </div>
    `);
}
export function UserAreLog() {
  ///
}

function htmlEncode(str) {
  var element = document.createElement('div');
  if (str) {
      element.innerText = str;
      element.textContent = str;
  }
  return element.innerHTML;
}

export function appendMessage(messagesContainer, msg, isOutgoing = true) {
  const messageElement = document.createElement("div");
  messageElement.className = `message-bubble ${
    isOutgoing ? "message-outgoing" : "message-incoming"
  }`;
  messageElement.innerHTML = `
      <p class="message-content">${htmlEncode(msg.content)}</p>
      <span class="timestamp">${formatMessageDate(msg.createdAt)}</span>
    `;
  messagesContainer.append(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

export async function createChatWindow(user) {
  const dom = chatTemplate(user);
  const window = dom.querySelector(".chat-window");
  const closeButton = dom.querySelector(".close-button");
  const chat = dom.querySelector("#chat");
  chat.dataset.username = user.Username;
  const input = dom.querySelector("#chat-input");
  const messagesContainer = dom.querySelector(".messages");
  const loader = dom.querySelector("#loader");
  closeButton.addEventListener("click", () => {
    chatopen.open = false
    chatData.loadedMessage = [];
    window.remove();
  });

  // fetch all previous conversations
  await oldMessages(user.User_id);

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadMoreMessages(messagesContainer, loader, user.User_id);
      }
    },
    { root: chat, threshold: 1.0 }
  );
  observer.observe(loader);
  loadMoreMessages(messagesContainer, loader, user.User_id);
  chat.scrollTop = chat.scrollHeight;

  const start = chatData.loadedMessage.length;
  if (start === chatData.allMessages.length) loader.remove();

  const throttledTypingStatus = throttle(() => {
    const msg = {
      type: "typing",
      receiver: user.Username,
      token: getCookie("session_token"),
    };
    sendMessage(msg);
  }, 900);

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      const msg = {
        type: "message",
        receiver: user.Username,
        content: input.value,
        createdAt: new Date().toString(),
        token: getCookie("session_token"),
      };
      input.value = "";
      let chat = document.querySelector(`#chat`)
      appendMessage(chat, msg, true);

      // Send message via WebSocket
      sendMessage(msg);
    } else {
      throttledTypingStatus();
    }
  });

  return dom;
}

const loadMoreMessages = (chat, loader, userID) => {
  const start = chatData.loadedMessage.length;
  if (start === chatData.allMessages.length) {
    loader.remove();
    return;
  }

  const messages = chatData.allMessages.slice(start, start + 10);
  chatData.loadedMessage.push(...messages);
  renderMessages(chat, userID, messages);
};

const renderMessages = (chat, userID, messages) => {
  messages.forEach((msg) => {
    const messageElement = document.createElement("div");
    messageElement.className = `message-bubble ${
      msg.sender == userID ? "message-incoming" : "message-outgoing"
    }`;
    messageElement.innerHTML = `
      <p class="message-content">${msg.content}</p>
      <span class="timestamp">${formatMessageDate(msg.createdAt)}</span>
    `;
    chat.prepend(messageElement);
  });
};

function getCookie(name) {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookieValue
    ? cookieValue.split("=")[1]
    : (window.location.href = "/login");
}
