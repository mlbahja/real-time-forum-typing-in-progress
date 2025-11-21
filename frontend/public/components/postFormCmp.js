export default function postForm() {
    return `
    <div id="popupOverlay">
        <h2>Create a Post</h2>
        <form id="createPostForm">
        <div class="user-profile">    
        <img src="static/src/Unknown_person.jpg" alt="profile" />
            <div>
                <p>Jhon</p>
                <small>Public <i class="fas fa-caret-down"></i></small>
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
    </div>
    `;
}
