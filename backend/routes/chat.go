package routes

import (
	"database/sql"
	"forum/controllers"
	"net/http"
)

// func Websocket(db *sql.DB) {
// 	// Getusers(db)
// 	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
// 		controllers.WebsocketController(db, w, r)
// 	})

// }

func Socket(db *sql.DB) {
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		/*if r.URL.Path == "/ws" {
			fmt.Println("Page not found to inter to this path okay letss go ")
			http.Error(w, "Page not found to inter to this path okay letss goo", http.StatusNotFound)
			return
		}*/
		controllers.WebsocketController(db, w, r)
	})
}
