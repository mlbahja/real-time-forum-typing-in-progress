import { router } from "../app.js";
import { Header } from "../components/header.js";
import { Loader } from "../components/loader.js";
import { PostForm } from "../components/postForm.js";
import { postContainer } from "../components/posts.js";
import { UsersList } from "../components/users.js";
import { createDom } from "../utils/createDom.js";

function indexTemplate() {
  const fragment = createDom(`
    <!-- Main Content -->
     <div class="content">
        <div class="left-sidebar">
            <div class="imp-links">
                <ul>
                    <li onclick="filterPosts('getcreatedposts')">created posts</li>
                    <li onclick="filterPosts('getlikedposts')">liked posts</li>
                </ul>
            </div>
        </div>
        <main class="main-content">
        <div class="post-form"></div>
             <!-- for creating post -->
        <div id="dynaicPost"></div>
            <section class="feed">
                <h2>POSTS</h2>
                <div class="post-list">
                    
                </div>
            </section>
            <button class="load-more">Load More</button>
        </main>
        <div class="right-sidebar">
            
        </div>
        

     </div>
    
    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-sections">
                <div>
                    <h4>Forum</h4>
                    <ul>
                        <li><a class="foo">Categories</a></li>
                        <li><a class="foo">Popular Posts</a></li>
                        <li><a class="foo">Help</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Legal</h4>
                    <ul>
                        <li><a class="foo">Terms of Service</a></li>
                        <li><a class="foo">Privacy Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Support</h4>
                    <ul>
                        <li><a class="foo">Contact Us</a></li>
                        <li><a class="foo">Report Issue</a></li>
                    </ul>
                </div>
            </div>
            <p>&copy; 2024 My Forum. All rights reserved.</p>
        </div>
    </footer>`);

  fragment.prepend(Header());
  fragment.querySelector(".post-form").append(PostForm());
  const postList = fragment.querySelector(".post-list");
  postContainer(postList);

  return fragment;
}

export function IndexPage() {
  const dom = indexTemplate();
  const sideBar = dom.querySelector(".right-sidebar");
  fillSideBar(sideBar);
  return dom;
}

async function fillSideBar(sidebarEl) {
  const loader = Loader();
  sidebarEl.append(loader);
  const usersDom = await UsersList();
  sidebarEl.append(usersDom);
  sidebarEl.querySelector(".spinner").remove();
}
