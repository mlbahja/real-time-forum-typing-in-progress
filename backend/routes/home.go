package routes

import (
	"net/http"

	"forum/controllers"
)

func HomeRoute() {
	controllers.ServeFiles()
	http.HandleFunc("/", controllers.Index)

	// Health check endpoint for Railway and other platforms
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok"}`))
	})
}
