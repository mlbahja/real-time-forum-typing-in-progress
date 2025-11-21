import { addComments } from "../api/comments.js";
import { createDom } from "../utils/createDom.js";
import { CommentItem } from "./comments.js";
import { displayToast } from "./toast.js";

function commentTemplate(post) {
  return createDom(`
        <h2><span>${post.comments_count}</span> Comments</h2>
        <div class="replyContainer">
        </div>
        <div id="Reply-section" class="reply-section">
            <h3>Reply</h3>
            <div class="editor">
            <textarea class="reply-input" placeholder="Add as many details as possible..."></textarea>
            </div>
            <button class="btn send-btn">Send</button>
        </div>
        `);
}

function Displayallcomment(dom, comment) {
  const divv = dom.querySelector(".comment-list");
  console.log(divv.value);
  
  divv.prepend(CommentItem(comment));
}
export function CommentForm(post) {
  const dom = commentTemplate(post);
  const sendBtn = dom.querySelector(".send-btn");
  const replyInput = dom.querySelector(".reply-input");

  sendBtn.addEventListener("click", onComment);

  async function onComment() {
    try {
      const data = await addComments(post.id, replyInput.value); // kqyn db
      // console.log();
      // show all comments without refershing
      Displayallcomment(
        replyInput.parentElement.parentElement.parentElement,
        data
      );
      // console.log(data);
    } catch (error) {
      displayToast(error.Message, "error");
    }
    replyInput.value = "";
  }

  return dom;
}
