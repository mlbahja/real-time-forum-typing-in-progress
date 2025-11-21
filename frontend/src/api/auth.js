import { waitForDOM } from '../utils/waitForDOM.js';
import { ws } from './websocket.js';
import { displayToast } from '../components/toast.js';

export async function fetchRegister(formData) {
  const requestData = Object.fromEntries(formData.entries());
  console.log(requestData);
  const response = await fetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.Message || "Something went wrong, please try again");
  }
  return data;
}

export async function fetchLogin(formData) {
  const requestData = Object.fromEntries(formData.entries());
  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.Message || "Invalid credentials");
  }
  waitForDOM();
  return data;
}

export async function getUserAuth() {
  const response = await fetch("/auth");
  console.log(response);
  if (!response.ok) throw new Error("unatuhrozed");
  const data = await response.json();
  return data.Message;
}

export async function fetchLogout() {
  await fetch("/auth/logout", { method: "POST" });
  ws.conn?.close();
  displayToast('Logout successfully!', 'success');
}
