import { dislikePost, likePost } from "../api/like.js";
import { createDom } from "../utils/createDom.js";
import { displayToast } from "./toast.js";

function likeTemplate(post) {
  return createDom(`
    <button class="btn like-btn ${post.reaction == "like" ? "liked" : ""}"  >
        <i class="fa fa-thumbs-o-up" style="font-size:18px"></i> Like
        (<span>${post.likes_count}</span>)
    </button>
    <button class="btn dislike-btn  ${
      post.reaction == "dislike" ? "disliked" : ""
    }">
        <i class="fa fa-thumbs-o-down" style="font-size:18px"></i> Dislike
        (<span>${post.dislikes_count}</span>)
    </button>`);
}

export function LikeItem(post) {
  const dom = likeTemplate(post);
  const likeBtn = dom.querySelector(".like-btn");
  const dislikeBtn = dom.querySelector(".dislike-btn");

  likeBtn.addEventListener("click", onLike);
  dislikeBtn.addEventListener("click", onDislike);

  async function onLike(e) {
    try {
      const requestData = {
        post_id: post.id,
        comment_id: null,
      };
      // console.log(requestData);
      const data = await likePost(requestData);
      updateLikeDom(data.Message);
    } catch (error) {
      // console.log(error);
      displayToast(error.message, "error");
    }
  }

  async function onDislike(e) {
    try {
      const requestData = {
        post_id: post.id,
        comment_id: null,
      };
      const data = await dislikePost(requestData);
      // console.log(data);
      updateDisLikeDom(data.Message);
    } catch (error) {
      displayToast(error.message, "error");
    }
  }

  function updateLikeDom(type) {
    const spanLike = likeBtn.querySelector("span");
    const spanDisLike = dislikeBtn.querySelector("span");

    if (type === "Updated") {
      post.dislikes_count--;
      post.likes_count++;

      spanDisLike.innerHTML = post.dislikes_count;
      spanLike.innerHTML = post.likes_count;

      dislikeBtn.classList.remove("disliked");
      likeBtn.classList.add("liked");
    } else if (type == "Removed") {
      post.likes_count--;

      spanLike.innerHTML = post.likes_count;

      likeBtn.classList.remove("liked");
    } else if (type == "Added") {
      post.likes_count++;

      likeBtn.classList.add("liked");
      spanLike.innerHTML = post.likes_count;
    }
  }

  function updateDisLikeDom(type) {
    const spanLike = likeBtn.querySelector("span");
    const spanDisLike = dislikeBtn.querySelector("span");

    if (type === "Updated") {
      post.dislikes_count++;
      post.likes_count--;

      spanDisLike.innerHTML = post.dislikes_count;
      spanLike.innerHTML = post.likes_count;

      dislikeBtn.classList.add("disliked");
      likeBtn.classList.remove("liked");
    } else if (type == "Removed") {
      post.dislikes_count--;

      spanDisLike.innerHTML = post.dislikes_count;

      dislikeBtn.classList.remove("disliked");
    } else if (type == "Added") {
      post.dislikes_count++;

      dislikeBtn.classList.add("disliked");
      spanDisLike.innerHTML = post.dislikes_count;
    }
  }
  return dom;
}
