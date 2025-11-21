import { createPost } from "../api/posts.js";
import { emitPostCreatedEvent } from "../event.js";
import { states } from "../states.js";
import { createDom } from "../utils/createDom.js";
import { Category } from "./category.js";
import { displayToast } from "./toast.js";

function postFormTemplate() {
  const dom = createDom(`
        <h2>Create a Post</h2>
        <form id="createPostForm">
        <div class="user-profile">    
        <img src="static/src/Unknown_person.jpg" alt="profile" />
            <div>
                <p>${states.user.username}</p>
            </div>
            </div>
            <label for="title">Title</label>
            <input type="text" id="title" name="title" placeholder="Enter post title"  required>

            <label for="content">Content</label>
            <textarea id="content" name="content" rows="5" placeholder="what's on your mind, username"  required></textarea>

            <label for="categories">Categories:</label><br>
            <div class="categories-container">
            </div>
            <button class="sbtn" type="submit">post</button>
        </form>
    `);

  return dom;
}

export function PostForm() {
  const dom = postFormTemplate();
  const createPostForm = dom.getElementById("createPostForm");
  const categoryContainer = dom.querySelector(".categories-container");
  const titleInput = dom.querySelector("#title");
  const contentInput = dom.querySelector("#content");
  addCatgeoryDom(categoryContainer);

  async function onCreatePost(e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const categories = Array.from(
      categoryContainer.querySelectorAll("input[type=checkbox]:checked"),
      (elem) => elem.value
    );

    try {
      const data = await createPost({ title, content, categories });
      emitPostCreatedEvent(data);
      titleInput.value = "";
      contentInput.value = "";
      categoryContainer
        .querySelectorAll("input[type=checkbox]:checked")
        .forEach((el) => el.click());
      displayToast("created post succesfully", "success");
    } catch (error) {
      displayToast(error.message, "error");
    }
  }

  createPostForm.addEventListener("submit", onCreatePost);
  return dom;
}

async function addCatgeoryDom(container) {
  const category = await Category();
  container.append(category);
}
