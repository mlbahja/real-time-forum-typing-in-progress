package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
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
			http.Error(w, "Failed to update user: "+err.Error(), http.StatusInternalServerError)
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

// MigrateDatabase adds the is_admin column if it doesn't exist
// IMPORTANT: Remove this route after running the migration!
func MigrateDatabase(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Check if column exists
		var columnExists bool
		rows, err := db.Query("PRAGMA table_info(users)")
		if err != nil {
			http.Error(w, "Failed to check table: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		for rows.Next() {
			var cid int
			var name, dataType string
			var notNull, dfltValue, pk interface{}
			if err := rows.Scan(&cid, &name, &dataType, &notNull, &dfltValue, &pk); err != nil {
				continue
			}
			if strings.ToLower(name) == "is_admin" {
				columnExists = true
				break
			}
		}

		if columnExists {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]interface{}{
				"message": "Column is_admin already exists. No migration needed.",
				"success": true,
			})
			return
		}

		// Add the column
		_, err = db.Exec("ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0 NOT NULL CHECK (is_admin IN (0, 1))")
		if err != nil {
			http.Error(w, "Failed to add column: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "Migration successful! is_admin column added. IMPORTANT: Remove the /setup/migrate endpoint from your code!",
			"success": true,
		})
	}
}
