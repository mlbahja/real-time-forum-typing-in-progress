package main

import (
	"fmt"
	"forum/config"
	"forum/routes"
	"log"
	"net/http"
)

func main() {
	// Use relative paths that work both in development and Docker
	dbPath := "../database/forum.db"
	schemaPath := "../database/schema.sql"

	config.DB = config.InitDB(dbPath)
	config.CreateDatabaseTables(config.DB, schemaPath)
	defer config.DB.Close()

	address := "0.0.0.0:8081"

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

	fmt.Printf("Server is running on http://%s \n", address)
	if err := http.ListenAndServe(":8081", nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
