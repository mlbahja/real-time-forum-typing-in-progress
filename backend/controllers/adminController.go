package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"forum/models"
	"net/http"
	"time"
)

// GetAllUsers returns all users (admin only)
func GetAllUsers(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		rows, err := db.Query(`
			SELECT user_id, username, first_name, last_name, age, email, gender, is_admin, created_at
			FROM users
			ORDER BY created_at DESC
		`)
		if err != nil {
			http.Error(w, "Failed to fetch users", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var users []models.User
		for rows.Next() {
			var user models.User
			var isAdmin int
			err := rows.Scan(&user.ID, &user.Username, &user.FirstName, &user.LastName,
				&user.Age, &user.Email, &user.Gender, &isAdmin, &user.CreatedAt)
			if err != nil {
				continue
			}
			user.IsAdmin = isAdmin == 1
			user.Password = "" // Don't send passwords
			users = append(users, user)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"users": users,
		})
	}
}

// GetAllPosts returns all posts (admin only)
func GetAllPosts(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		rows, err := db.Query(`
			SELECT p.post_id, p.title, p.content, p.category_name, p.created_at,
				   u.username, u.user_id
			FROM posts p
			JOIN users u ON p.user_id = u.user_id
			ORDER BY p.created_at DESC
		`)
		if err != nil {
			http.Error(w, "Failed to fetch posts", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var posts []map[string]interface{}
		for rows.Next() {
			var postID, title, content, category, username string
			var userID int
			var createdAt time.Time
			err := rows.Scan(&postID, &title, &content, &category, &createdAt, &username, &userID)
			if err != nil {
				continue
			}
			posts = append(posts, map[string]interface{}{
				"post_id":       postID,
				"title":         title,
				"content":       content,
				"category_name": category,
				"created_at":    createdAt,
				"username":      username,
				"user_id":       userID,
			})
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"posts": posts,
		})
	}
}

// DeletePost allows admin to delete any post
func DeletePost(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodDelete {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		postID := r.URL.Query().Get("post_id")
		if postID == "" {
			http.Error(w, "Post ID required", http.StatusBadRequest)
			return
		}

		_, err := db.Exec("DELETE FROM posts WHERE post_id = ?", postID)
		if err != nil {
			http.Error(w, "Failed to delete post", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "Post deleted successfully",
		})
	}
}

// DeleteComment allows admin to delete any comment
func DeleteComment(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodDelete {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		commentID := r.URL.Query().Get("comment_id")
		if commentID == "" {
			http.Error(w, "Comment ID required", http.StatusBadRequest)
			return
		}

		_, err := db.Exec("DELETE FROM comments WHERE comment_id = ?", commentID)
		if err != nil {
			http.Error(w, "Failed to delete comment", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "Comment deleted successfully",
		})
	}
}

// GetDashboardStats returns statistics for admin dashboard
func GetDashboardStats(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var totalUsers, totalPosts, totalComments int
		db.QueryRow("SELECT COUNT(*) FROM users").Scan(&totalUsers)
		db.QueryRow("SELECT COUNT(*) FROM posts").Scan(&totalPosts)
		db.QueryRow("SELECT COUNT(*) FROM comments").Scan(&totalComments)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"total_users":    totalUsers,
			"total_posts":    totalPosts,
			"total_comments": totalComments,
		})
	}
}

// ToggleUserAdmin allows admin to make another user admin or remove admin status
func ToggleUserAdmin(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var reqData struct {
			UserID  int  `json:"user_id"`
			IsAdmin bool `json:"is_admin"`
		}

		if err := json.NewDecoder(r.Body).Decode(&reqData); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		adminValue := 0
		if reqData.IsAdmin {
			adminValue = 1
		}

		_, err := db.Exec("UPDATE users SET is_admin = ? WHERE user_id = ?", adminValue, reqData.UserID)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to update user: %v", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "User admin status updated successfully",
		})
	}
}
