package main

import (
	"fmt"
	"forum/config"
	"forum/routes"
	"log"
	"net/http"
)

func main() {
	config.DB = config.InitDB("../database/forum.db")
	config.CreateDatabaseTables(config.DB, "../database/schema.sql")
	defer config.DB.Close()

	address := "localhost:8080"

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
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
