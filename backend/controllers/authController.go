package controllers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"html"
	"net/http"
	"time"

	"forum/config"
	"forum/models"
	"forum/utils"

	"golang.org/x/crypto/bcrypt"
)

// RegisterUser handles user registration
func RegisterUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		err := errors.New("method not allowed")
		utils.CreateResponseAndLogger(w, http.StatusMethodNotAllowed, err, "Method not allowed")
		return
	}
	var user models.User
	w.Header().Set("Content-Type", "application/json")

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
		return
	}
	fmt.Println("us", user)
	user.Username = html.EscapeString(user.Username)
	user.Email = html.EscapeString(user.Email)
	user.Password = html.EscapeString(user.Password)
	user.FirstName = html.EscapeString(user.FirstName)
	user.LastName = html.EscapeString(user.LastName)
	// user.Age = html.EscapeString(user.Age)

	// if err := utils.Validation(user, true); err != nil {
	// 	utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, err.Error())
	// 	return
	// }

	if err := utils.Hash(&user.Password); err != nil {
		utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
		return
	}
	query := "INSERT INTO users (username, email, password, first_name, last_name, gender, age) VALUES (?, ?, ?, ?, ?, ?, ?)"
	_, err := config.DB.Exec(query, user.Username, user.Email, user.Password, user.FirstName, user.LastName, user.Gender, user.Age)
	if err != nil {
		if err.Error() == "UNIQUE constraint failed: users.username" {
			utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "Username already exists")
			return
		} else if err.Error() == "UNIQUE constraint failed: users.email" {
			utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "Email already exists")
			return
		}
		utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
		return
	}
	utils.CreateResponseAndLogger(w, http.StatusCreated, nil, "User created successfully")
}

// LoginUser handles user login
func LoginUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("path : >>>>>>>>>>>>> ", r.URL.Path)

	if r.Method != http.MethodPost {
		err := errors.New("method not allowed ")
		utils.CreateResponseAndLogger(w, http.StatusMethodNotAllowed, err, "Method not allowed")
		return
	}

	var user models.User
	var userFromDb models.User

	// if r.URL.Path == "/login" {
	// 	return
	// }

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
		return
	}

	// if err := utils.Validation(user, false); err != nil {
	// 	utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, err.Error())
	// 	return
	// }

	query := "SELECT user_id, username, email, password FROM users WHERE email = ? OR username = ?"
	row := config.DB.QueryRow(query, user.Username, user.Username)
	err := row.Scan(&userFromDb.ID, &userFromDb.Username, &userFromDb.Email, &userFromDb.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "no user found with this username")
			return
		} else {
			utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
			return
		}
	}
	if err := utils.CheckPassword(user.Password, userFromDb.Password); err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "invalid password")
			return
		} else {
			utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
			return
		}
	}
	err = utils.TokenCheck(userFromDb.ID, r, config.DB)
	if err != nil {
		if err.Error() == "token mismatch" {
			deleteCookie := &http.Cookie{
				Name:  "session_token",
				Value: "",
				Path:  "/", //login >>>>> ..
				// HttpOnly: true,
				// Secure:   false,
				Expires: time.Now().Add(config.DELETE_COOKIE_DATE),
			}
			http.SetCookie(w, deleteCookie)
			utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "Token Expired. Please login again")
			return
		} else {
			utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "user already logged in")
			return
		}
	}
	token, err := utils.SeesionCreation(userFromDb.ID, config.DB)
	if err != nil {
		utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
		return
	}
	cookie := &http.Cookie{
		Name:  "session_token",
		Value: token,
		Path:  "/",
		// HttpOnly: true,
		// Secure:   false,
		Expires: time.Now().Add(config.EXPIRIATION_SESSION_DATE),
	}
	http.SetCookie(w, cookie)
	utils.CreateResponseAndLogger(w, http.StatusOK, nil, "user logged-in successfully")
}

// LogoutUser handles user logout

func Logout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		err := errors.New("method not allowed")
		utils.CreateResponseAndLogger(w, http.StatusMethodNotAllowed, err, "Method not allowed")
		return
	}

	cookie, err := r.Cookie("session_token")
	if err != nil {
		utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "user not logged-in")
		return
	}
	query := "DELETE FROM sessions WHERE session_id = ?"
	_, err = config.DB.Exec(query, cookie.Value)
	if err != nil {
		utils.CreateResponseAndLogger(w, http.StatusInternalServerError, err, "Internal server error")
		return
	}
	deleteCookie := &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Path:     "/",
		// HttpOnly: true,
		// Secure:   false,
		Expires:  time.Now().Add(config.DELETE_COOKIE_DATE),
	}
	http.SetCookie(w, deleteCookie)
	utils.CreateResponseAndLogger(w, http.StatusOK, nil, "user logged-out successfully")
}

type SessionUser struct {
	UserID   int    `json:"id"`
	Username string `json:"username"`
}

func AuthData(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/auth" {
		fmt.Println("AuthData ....... Pathss ... ")
		err := errors.New("this is the Path..... ")
		utils.CreateResponseAndLogger(w, http.StatusMethodNotAllowed, err, "Path not alowed ..*********")
		return
	}
	if r.Method != http.MethodGet {
		err := errors.New("method not allowed")
		utils.CreateResponseAndLogger(w, http.StatusMethodNotAllowed, err, "Method not allowed")
		return
	}

	cookie, err := r.Cookie("session_token")
	if err != nil {
		utils.CreateResponseAndLogger(w, http.StatusBadRequest, err, "user not logged-in")
		return
	}

	query := "SELECT s.user_id, u.username from sessions s JOIN users u on u.user_id = s.user_id WHERE s.session_id = ?"

	var su SessionUser
	err = config.DB.QueryRow(query, cookie.Value).Scan(&su.UserID, &su.Username)

	// Handle possible errors
	fmt.Printf("session %+v user data %+v", cookie, su)
	if err != nil {
		utils.CreateResponseAndLogger(w, http.StatusUnauthorized, nil, err.Error())
		return
	}
	utils.CreateResponseAndLogger(w, http.StatusOK, nil, su)
}
