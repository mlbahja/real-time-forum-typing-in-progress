package main

import (
	"fmt"
	"forum/config"
	"forum/controllers"
	"forum/routes"
	"log"
	"net/http"
	"os"
)

func main() {
	// Check if database exists in Docker location first, then fallback to dev location
	dbPath := "./database/forum.db"
	schemaPath := "./database/schema.sql"

	// If running from backend directory (development)
	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		dbPath = "../database/forum.db"
		schemaPath = "../database/schema.sql"
	}

	config.DB = config.InitDB(dbPath)
	config.CreateDatabaseTables(config.DB, schemaPath)
	defer config.DB.Close()

	// Get port from environment variable (for Railway, Render, etc.) or default to 8081
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}
	address := "0.0.0.0:" + port

	// Existing routes
	routes.GetChat(config.DB)
	routes.Getusers(config.DB)
	routes.HomeRoute()
	routes.AuthRoutes()
	routes.PostRoute(config.DB)
	routes.ReactionsRoute(config.DB)
	routes.CommentsRoute(config.DB)
	routes.CategoriesRoute(config.DB)
	routes.FilterRoute(config.DB)
	routes.Socket(config.DB)
	routes.AdminRoutes(config.DB)

	// One-time setup routes - TODO: Remove these after making yourself admin!
	http.HandleFunc("/setup/migrate", controllers.MigrateDatabase(config.DB))
	http.HandleFunc("/setup/make-admin", controllers.MakeFirstUserAdmin(config.DB))

	fmt.Printf("Server is running on http://%s \n", address)
	log.Printf("Listening on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
