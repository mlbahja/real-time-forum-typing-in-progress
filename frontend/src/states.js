import { getUserAuth } from "./api/auth.js";

export const states = {
  user: {},
  isAuth: false,
};

export async function initAuth() {
  try {
    const userData = await getUserAuth();
    states.user = userData;
    states.isAuth = true;
  } catch (error) {
    states.isAuth = false;
  }
}

export const openChats = new Set();
