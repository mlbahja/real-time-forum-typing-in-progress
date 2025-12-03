package routes

import (
	"database/sql"
	"net/http"

	"forum/controllers"
	"forum/utils"
)

func AdminRoutes(db *sql.DB) {
	// All admin routes require admin authentication
	http.HandleFunc("/admin/stats", utils.RequireAdmin(db, controllers.GetDashboardStats(db)))
	http.HandleFunc("/admin/users", utils.RequireAdmin(db, controllers.GetAllUsers(db)))
	http.HandleFunc("/admin/posts", utils.RequireAdmin(db, controllers.GetAllPosts(db)))
	http.HandleFunc("/admin/delete-post", utils.RequireAdmin(db, controllers.DeletePost(db)))
	http.HandleFunc("/admin/delete-comment", utils.RequireAdmin(db, controllers.DeleteComment(db)))
	http.HandleFunc("/admin/toggle-admin", utils.RequireAdmin(db, controllers.ToggleUserAdmin(db)))
}
