import { getComment } from "../api/comments.js";
import { createDom } from "../utils/createDom.js";

function commentTemplate(comment) {
  return createDom(`
        <section class="comments">
            <div class="comment card-content">
              <div class="comment-header">
                <img src="./static/src/Unknown_person.jpg" alt="User Avatar" class="user-avatar">
                <div class="comment-details"><p><strong>${
                  comment.author
                }</strong> <span class="user-role"></span></p><p class="comment-time time">${
    comment.createdat
  }</p>
                </div>
              </div>
              <div class="comment-body">
                <pre>${comment.content}</pre>
              </div>
              <div id="Comment-footer" class="comment-footer">
                
                
              </div>
            </div>
            <!-- Reply Section -->
            
          </section>
        `);
}

function CommentContainerTemplate() {
  return createDom(`
        <div class="comment-list"></div>    
    `);
}

// {
//     "author_id": 1,
//     "author": "mlbahja",
//     "post_id": "2336c830-1660-48c8-a8d2-48adfb273cf3",
//     "id": "f65fcace-6649-4bb9-9660-1aed3319e4f0",
//     "content": "hhhh",
//     "createdat": "2025-03-10 12:06:01",
//     "likescount": 0,
//     "dislikescount": 0,
//     "reaction": ""
// }

export function CommentItem(comment) {
  const dom = commentTemplate(comment);
  return dom;
}


export function CommentContainer(post) {
  // console.log(post.id);

  const dom = CommentContainerTemplate();
  const commentList = dom.querySelector(".comment-list");
  async function loadComments() {
    const comments = await getComment(post.id);
    // console.log(comments);

    comments?.comments?.forEach((comment) => {
      commentList.append(CommentItem(comment));
      // console.log(comment);
    });
  }

  loadComments();
  return dom;
}
