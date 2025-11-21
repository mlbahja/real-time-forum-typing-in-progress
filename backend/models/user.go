package models

import "time"

//	type User struct {
//		ID        int       `json:"id"`
//		Username  string    `json:"username"`
//		FirstName string    `json:"firstname"`
//		LastName  string    `json:"lastname"`
//		Age       int       `json:"age"`
//		Gender    string    `json:"gender"`
//		Email     string    `json:"email"`
//		Password  string    `json:"password"`
//		CreatedAt time.Time `json:"createdat"`
//	}
type User struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	FirstName string    `json:"firstname"`
	LastName  string    `json:"lastname"`
	Age       int       `json:"age,string"`
	Gender    string    `json:"gender"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	CreatedAt time.Time `json:"createdat"`
}
