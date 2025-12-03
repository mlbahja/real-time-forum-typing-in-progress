package config

import (
	"database/sql"
	"os"
	"time"
)

const EXPIRIATION_SESSION_DATE = 25 * time.Hour
const DELETE_COOKIE_DATE = -time.Hour * 24 * 365

var STATIC_DIR_PUBLIC string
var STATIC_DIR string

var DB *sql.DB

func init() {
	// Check if frontend exists in Docker location first, then fallback to dev location
	if _, err := os.Stat("./frontend"); err == nil {
		// Docker environment - running from /root/
		STATIC_DIR = "./frontend"
		STATIC_DIR_PUBLIC = "./frontend/public"
	} else {
		// Development environment - running from /backend/
		STATIC_DIR = "../frontend"
		STATIC_DIR_PUBLIC = "../frontend/public"
	}
}
