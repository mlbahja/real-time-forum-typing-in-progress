export const chatData = {
  allMessages: [],
  loadedMessage: [],
  unloadedMessages: []
}

export async function oldMessages(id) {
  // Fetch chat history
  const response = await fetch(`/chathistory?receiver=${id}`);
  if (!response.ok) {
    throw new Error("Error fetching chat history");
  }

  chatData.allMessages = await response.json() || [];
}
