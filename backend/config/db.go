package config

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB
var IsPostgres bool

func InitDB(dataSourceName string) *sql.DB {
	// Check if DATABASE_URL is set (Railway PostgreSQL)
	dbURL := os.Getenv("DATABASE_URL")

	var db *sql.DB
	var err error

	if dbURL != "" {
		// Use PostgreSQL
		log.Println("Using PostgreSQL database")
		IsPostgres = true
		db, err = sql.Open("postgres", dbURL)
		if err != nil {
			log.Fatalf("Failed to connect to PostgreSQL: %v", err)
		}
	} else {
		// Use SQLite (local development)
		log.Println("Using SQLite database")
		IsPostgres = false
		db, err = sql.Open("sqlite3", dataSourceName)
		if err != nil {
			log.Fatalf("Failed to connect to SQLite: %v", err)
		}
	}

	if err = db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	return db
}

func CreateDatabaseTables(db *sql.DB, dbPath string) {
	// Use PostgreSQL schema if DATABASE_URL is set
	schemaPath := dbPath
	if IsPostgres {
		// Replace schema.sql with schema_postgres.sql
		if dbPath == "./database/schema.sql" {
			schemaPath = "./database/schema_postgres.sql"
		} else if dbPath == "../database/schema.sql" {
			schemaPath = "../database/schema_postgres.sql"
		}
		log.Println("Using PostgreSQL schema:", schemaPath)
	} else {
		log.Println("Using SQLite schema:", schemaPath)
	}

	schema, err := os.ReadFile(schemaPath)
	if err != nil {
		log.Fatal("Failed to read the schema: ", err)
	}

	_, err = db.Exec(string(schema))
	if err != nil {
		log.Fatal("Failed to execute the schema: ", err)
	}

	log.Println("Database tables created successfully")
}
