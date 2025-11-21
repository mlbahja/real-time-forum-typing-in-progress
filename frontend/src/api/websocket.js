import { appendMessage } from "../components/chatBox.js";
import { displayToast } from "../components/toast.js";

// object contains websocket connection
export const ws = {};
const timeout = {};

// initializing the websocket connection
export function initializeWebsocket() {
  ws.conn = new WebSocket("ws://localhost:8080/ws");
  ws.conn.onopen = () => {
    console.log("Connected to WebSocket server");
  };

  ws.conn.onmessage = receiveMessage;
  ws.conn.onerror = (err) => {
    ws.conn.close();
    console.error("Websocket error : %v", err);
  };
  ws.conn.onclose = () => {
    window.location.href = "/login"
    console.log("Disconnected from WebSocket server");
  };
}
export const sendMessage = (message) => {
  const usersList = document.querySelector(".users-list");
  const userItem = document.querySelector(
    `.online-list[data-username='${message.receiver}']`
  );

  // move the user to top list
  usersList.prepend(userItem);
  ws.conn.send(JSON.stringify(message));
};

const receiveMessage = (e) => {
  const res = JSON.parse(e.data);

  if(res.Logout){
    window.location.href = "/login"
  }
  switch (res.type) {
    case "online":
      const userItem = document.querySelector(
        `.online-list[data-userid='${res.data.userID}'] .status-indicator`
      );
      if (userItem) userItem.classList.add("status-online");
      break;
    case "offline":
      document
        .querySelector(
          `.online-list[data-userid='${res.data.userID}'] .status-indicator`
        )
        ?.classList?.remove("status-online");
      break;
    case "message":
      console.log("data message : ", res);

      const chat = document.querySelector(
        `#chat[data-username="${res.sender}"]`
      );
      const usersList = document.querySelector(".users-list");
      const userItem1 = document.querySelector(
        `.online-list[data-username='${res.sender}']`
      );

      if (chat) {
        appendMessage(chat, res, false);
      } else {
        displayToast(`New message from ${res.sender}`, "info");
      }

      // move the user to top list
      usersList.prepend(userItem1);
      break;
    case "typing":
      const chatCtn = document.querySelector(
        `#chat[data-username="${res.sender}"]`
      );

      if (chatCtn) {
        document.querySelector("#typing").style.display = "block";

        clearTimeout(timeout.id);
        timeout.id = setTimeout(() => {
          document.querySelector("#typing").style.display = "none";
        }, 1000);
      }
  }
};
