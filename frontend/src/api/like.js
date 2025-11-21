async function reactPost(requestData, type) {
  const response = await fetch(`/reaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reaction_type: type,
      ...requestData,
    }),
  });
  const responseData = await response.json();

  return responseData;
}

export async function dislikePost(requestData) {
  return await reactPost(requestData, "dislike");
}

export async function likePost(requestData) {
  return await reactPost(requestData, "like");
}
