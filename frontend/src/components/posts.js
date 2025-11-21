import { fetchPosts } from "../api/posts.js";
import { createDom } from "../utils/createDom.js";
import { formatDate } from "../utils/date.js";
import { CommentForm } from "./commentForm.js";
import { CommentContainer } from "./comments.js";
import { LikeItem } from "./like.js";
import { Loader } from "./loader.js";

function postItemTemplate(post) {
  return createDom(`
    <article class="post-preview">
      <div class="post-header">
        <h4 class="post-title">${post.title}</h4>
        <div class="comment-header comment-details">

        <img src="./static/src/Unknown_person.jpg" alt="User Avatar" class="user-avatar">
        
        <p class="time">By <strong>${
          post.author
        }</strong> | Category: <em>${post.categories.map(
    (cat) =>
      ` 
    <span> ${cat}</span>`
  )}
        </em> <br>
         ${post.createdat}</p>
      </div>
      </div>
      <div>
      <pre class="post-snippet card-content">${
        post.content.length > 100
          ? `${post.content.slice(0, 76)}
<button onclick="popPost(event, '${post.id}')">Read More...</button>`
          : `${post.content}`
      }</pre>
      </div>

      <div class="post-details">
        <button class="btn comment-btn">💬 Comment</button>
      </div>
      <!-- Comments Section (Initially Hidden) -->
      <div class="container-comment hidden">
        
      </div>
    </article>`);
}

function PostItem(post) {
  const dom = postItemTemplate(post);
  const commentButton = dom.querySelector(".comment-btn");
  const postDetails = dom.querySelector(".post-details");
  const commentContainer = dom.querySelector(".container-comment");

  commentContainer.append(CommentForm(post));
  commentContainer.append(CommentContainer(post));
  postDetails.prepend(LikeItem(post));

  commentButton.addEventListener("click", onToggleComment);

  function onToggleComment(e) {
    commentContainer.classList.toggle("hidden");
  }
  //fetch comment
  return dom;
}

export async function postContainer(container) {
  const cursor = formatDate(new Date());
  const postItemFragment = document.createDocumentFragment();
  const loader = Loader();
  container.append(loader);
  const posts = await fetchPosts(cursor);
  posts.forEach((post) => {
    postItemFragment.append(PostItem(post));
  });
  document.addEventListener("postCreated", (e) => {
    // console.log(e);
    const postItem = PostItem(e.detail);
    container.prepend(postItem);
  });
  container.querySelector(".spinner").remove();
  container.append(postItemFragment);
}
