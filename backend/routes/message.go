package routes

import (
	"database/sql"
	"net/http"

	"forum/controllers"
)

func GetChat(db *sql.DB) {
	http.HandleFunc("/chathistory", func(w http.ResponseWriter, r *http.Request) {
		controllers.GetChatHistory(db, w, r)
	})
}
