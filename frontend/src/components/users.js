import { fetchUsers } from "../api/users.js";
import { createDom } from "../utils/createDom.js";
import { wait } from "../utils/wait.js";
import { createChatWindow } from "./chatBox.js";

const openChats = new Set();

function usersListTemplate() {
  return createDom(`<div id="online-list-container">
  <!-- Contacts Header -->
  <div class="section-header">Contacts</div>

    <div class="users-list"></div>
</div>
<div class="chat-container"></div>
`);
}

function userItemTemlate(user) {
  return createDom(`
    <div class="online-list" data-userid="${user.User_id}" data-username="${user.Username}">
    <div class="online">
      <img src="static/src/Unknown_person.jpg" alt="profile" />
      <div class="status-indicator"></div>
    </div>
    <p>${user.Username}</p>
  </div>
`);
}

function UserItem(user) {
  const dom = userItemTemlate(user);
  return dom;
}

export const chatopen = { open: false };  // ✅ Use an object

export async function UsersList() {
  const dom = usersListTemplate();
  const usersContainer = dom.querySelector(".users-list");
  const container = dom.querySelector(".chat-container");
  await wait(1000);
  const usersData = await fetchUsers();
  usersData.forEach((user) => {
    const userItem = UserItem(user);
    const openChat = userItem.querySelector(".online-list");
    usersContainer.append(userItem);
    openChat.addEventListener("click", async () => {
      if (chatopen.open) return
      chatopen.open = true
      container.innerHTML = "";
      container.append(await createChatWindow(user));
      // openChats.add(user.User_id);
      const chat = document.querySelector('#chat');
      chat.scrollTop = chat.scrollHeight;      
    });
  });

  return dom;
}
