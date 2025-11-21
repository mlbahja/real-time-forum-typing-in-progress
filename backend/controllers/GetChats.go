package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

// get all messages from data {sende rs}
// pa
// fortend
// page
/*
type Message struct {
	Sender    string `json:"sender"`
	Receiver  string `json:"receiver"`
	Content   string `json:"content"`
	CreatedAt string `json:"createdAt"`
}
*/
func GetChats(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	var chats Message
	if err := json.NewDecoder(r.Body).Decode(&chats); err != nil {

	}
}
