package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"forum/controllers"
	"net/http"
)

func Getusers(db *sql.DB) {
	http.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			users, err := controllers.Existedusers(db, w, r)
			if err != nil {
				fmt.Errorf("TEST : %v", err)
			}
			w.Header().Set("Content-Type", "application/json")
			if err := json.NewEncoder(w).Encode(users); err != nil {
				fmt.Errorf("errrror %v ", err)
			}
		} else {
			http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		}
	})
}
