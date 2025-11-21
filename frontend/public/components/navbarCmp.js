// function loadNavbar() {
//     const navbarHTML = `
//         <span class="toast"></span>
        
//         <header class="navbar">
//             <div class="container">
//                 <div class="nav-left">
//                     <img src="static/src/logo.png" alt="logo" class="logo" />
//                 </div>
//                 <nav class="navbar-right">
//                     <div class="nav-user-icon online" onclick="settingsMenuToggle()">
//                         <img src="static/src/Unknown_person.jpg" alt="profile" />
//                     </div>
//                     <!-- settings-menu -->
//                     <div class="settings-menu">
//                         <div class="setting-menu-inner">
//                             <div class="user-profile">
//                                 <img src="static/src/Unknown_person.jpg" alt="profile" />
//                                 <div>
//                                     <p>Jhon</p>
//                                     <small>Public <i class="fas fa-caret-down"></i></small>
//                                 </div>
//                             </div>
//                             <hr>
//                             <div class="theme-toggle">
//                                 <span class="theme-label">Theme</span>
//                                 <label class="switch">
//                                     <input type="checkbox" id="theme-switch">
//                                     <span class="slider round"></span>
//                                 </label>
//                             </div>
//                             <hr>
//                             <div class="nav-actions">
//                                 <button id="logoutt" class="btn logout">Logout</button>
//                             </div>
//                             <hr>
//                         </div>
//                     </div>
//                 </nav>
//             </div>
//         </header>
//     `;

//     // Inject into the page
//     document.getElementById("navbar-container").innerHTML = navbarHTML;
// }

// // Ensure the DOM is loaded before inserting the navbar
// document.addEventListener("DOMContentLoaded", loadNavbar);