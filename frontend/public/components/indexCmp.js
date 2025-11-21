export default function Index() {
    return `
    <div id="global">
                <!-- Navigation Bar -->
    <header class="navbar">
        <div class="container">
            <div class="nav-left">
                <img src="static/src/logo.png" alt="logo" class="logo" />
            </div>
            <nav class="navbar-right">
                <div class="nav-user-icon online menu-toggle">
                    <img src="static/src/Unknown_person.jpg" alt="profile" />
                </div>
                <!-- settings-menu -->
                <div class="settings-menu">
                    <div class="setting-menu-inner">
                        <div class="user-profile">
                            <img src="static/src/Unknown_person.jpg" alt="profile" />
                            <div>
                                <p>Jhon</p>
                                <small>Public <i class="fas fa-caret-down"></i></small>
                            </div>
                        </div>
                        <hr>
                        <div class="theme-toggle">
                            <span class="theme-label">Theme</span>
                            <label class="switch">
                                <input type="checkbox" id="theme-switch">
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <hr>
                        <div class="nav-actions">
                            <button id="logoutt" class="btn logout">Logout</button>
                        </div>
                        <hr>
                    </div>
                </div>
        </div>
    </header>
    <!-- Main Content -->
     <div class="content">
        <div class="left-sidebar">
            <div class="imp-links">
                <ul>
                    <li onclick="filterPosts('getcreatedposts')">created posts</li>
                    <li onclick="filterPosts('getlikedposts')">liked posts</li>
                </ul>
            </div>
            <div>
                <li class="shortcut-links">
                    <p>Filter</p>
                    <ul class="dropdown-menu">
                <li>
                  <input
                    type="checkbox"
                    id="tech"
                    name="categories"
                    value="Technology"
                  />
                  <label for="tech">Technology</label>
                </li>
                <li>
                  <input
                    type="checkbox"
                    id="sp"
                    name="categories"
                    value="Sport"
                  />
                  <label for="sp">Sport</label>
                </li>
                <li>
                  <input
                    type="checkbox"
                    id="he"
                    name="categories"
                    value="Health"
                  />
                  <label for="he">Health</label>
                </li>
                <li>
                  <input
                    type="checkbox"
                    id="li"
                    name="categories"
                    value="Lifestyle"
                  />
                  <label for="li">Lifestyle</label>
                </li>
                <li>
                  <input
                    type="checkbox"
                    id="ed"
                    name="categories"
                    value="Education"
                  />
                  <label for="ed">Education</label>
                </li>
                <button onclick="filterPosts('filterbycategories')" class="sbtf" type="submit">filter</button>
              </ul>
                </li>
            </div>

        </div>
        <main class="main-content">
             <!-- for creating post -->
        <div id="dynaicPost"></div>
            <section class="feed">
                <h2>POSTS</h2>
                <div class="post-list">
                    <div id="spinner"></div>
                </div>
            </section>
            <button class="load-more">Load More</button>
        </main>
        <div class="right-sidebar">
            <div id="online-list-container">
            <div class="chat-container"></div>
            </div>
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
    </footer>

    `
}