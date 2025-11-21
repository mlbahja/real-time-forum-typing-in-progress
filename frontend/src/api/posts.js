import { formatDate } from "../utils/date.js";

export async function fetchPosts(cursor) {
  let url = `/post`;

  let res = await fetch(url);
  let data = await res.json();
  if (!res.ok) {
    throw new Error("Something went wrong, please try again");
  }
  return data.posts || [];
}

export async function createPost(requestData) {
  const response = await fetch("/post", {
    method: "POST",
    body: JSON.stringify(requestData),
  });
  if (!response.ok) {
    const data = await response.text();
    throw new Error(data || "Error add new post");
  }
  return await response.json();
}
