export async function addComments(Post_id, Content) {
  const response = await fetch("/comment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Post_id, Content }),
  });

  let data = await response.json();
  if (!response.ok) throw data;
  console.log("comment data :",data);
  
  return data;
}


export async function getComment(postId){
    let url = `/comment?id=${postId}`;
    const response = await fetch(url)
    let data = await response.json()
    if (!response.ok) throw data;
    return data
}