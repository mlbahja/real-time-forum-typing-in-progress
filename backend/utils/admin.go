package utils

import (
	"database/sql"
	"net/http"
)

// CheckIsAdmin checks if the current user is an admin
func CheckIsAdmin(db *sql.DB, r *http.Request) (bool, error) {
	cookie, err := r.Cookie("session_id")
	if err != nil {
		return false, err
	}

	var isAdmin int
	query := `
		SELECT u.is_admin
		FROM users u
		JOIN sessions s ON CAST(u.user_id AS TEXT) = s.user_id
		WHERE s.session_id = ?
	`
	err = db.QueryRow(query, cookie.Value).Scan(&isAdmin)
	if err != nil {
		return false, err
	}

	return isAdmin == 1, nil
}

// RequireAdmin middleware to protect admin routes
func RequireAdmin(db *sql.DB, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		isAdmin, err := CheckIsAdmin(db, r)
		if err != nil || !isAdmin {
			http.Error(w, "Unauthorized: Admin access required", http.StatusForbidden)
			return
		}
		next(w, r)
	}
}
