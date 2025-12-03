package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

// MakeFirstUserAdmin is a one-time setup endpoint to make the first registered user an admin
// IMPORTANT: Remove this route after you've made yourself admin!
func MakeFirstUserAdmin(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Get username from request
		var reqData struct {
			Username string `json:"username"`
		}

		if err := json.NewDecoder(r.Body).Decode(&reqData); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		if reqData.Username == "" {
			http.Error(w, "Username required", http.StatusBadRequest)
			return
		}

		// Update user to admin
		result, err := db.Exec("UPDATE users SET is_admin = 1 WHERE username = ?", reqData.Username)
		if err != nil {
			http.Error(w, "Failed to update user", http.StatusInternalServerError)
			return
		}

		rows, _ := result.RowsAffected()
		if rows == 0 {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "User successfully made admin. IMPORTANT: Remove the /setup/make-admin endpoint from your code!",
			"success": true,
		})
	}
}
