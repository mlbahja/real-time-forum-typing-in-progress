package routes

import (
	"database/sql"
	"forum/controllers"
	"net/http"
)
 func chats(DB *sql.DB) {
	
	http.HandleFunc("/Chats", func(w http.ResponseWriter, r *http.Request) {
 		if r.Method != http.MethodGet{
			http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
			return
		}
		controllers.GetChats(DB,w, r)
		
 	})
 }
