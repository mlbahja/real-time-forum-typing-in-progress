import { initializeWebsocket } from "../api/websocket.js";

export const waitForDOM = () => {
    let id = setInterval(() => {
        let elem = document.querySelector(".online-list");
        if (elem) {
            clearInterval(id);
            initializeWebsocket();
        }
    }, 200);
}