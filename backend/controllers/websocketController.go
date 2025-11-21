package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"forum/utils"
	"html"
	"net/http"

	"github.com/gorilla/websocket"
)

var (
	conns    = make(map[int][]*websocket.Conn)
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

type Message struct {
	Type      string `json:"type"`
	Sender    string `json:"sender"`
	Receiver  string `json:"receiver"`
	Content   string `json:"content"`
	CreatedAt string `json:"createdAt"`
	Token     string `json:"token"`
	Logout    bool
}

type Response struct {
	Type   string         `json:"type"`
	Data   map[string]any `json:"data"`
	Logout bool
}

func getUseridByName(username string, db *sql.DB) (int, error) {
	query := `SELECT user_id FROM users WHERE username = ?`
	id := 0
	err := db.QueryRow(query, username).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("failed to get user id %v", err)
	}
	return id, nil
}

func getNameByUserid(id int, db *sql.DB) (string, error) {
	query := `SELECT username FROM users WHERE user_id = ?`
	name := ""
	err := db.QueryRow(query, id).Scan(&name)
	if err != nil {
		return "", fmt.Errorf("failed to get user id %v", err)
	}
	return name, nil
}

func WebsocketController(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	userid, _ := utils.UserIDFromToken(r, db)
	conns[userid] = append(conns[userid], conn)

	defer func() {
		for i, c := range conns[userid] {
			if c == conn {
				conns[userid] = append(conns[userid][:i], conns[userid][i+1:]...)
				break
			}
		}
		if len(conns[userid]) == 0 {
			delete(conns, userid)
			broadcastOnlineStatus(userid, false, true)
		}
		conn.Close()
	}()

	// Only broadcast online status if this is user's first connection
	if len(conns[userid]) == 1 {
		broadcastOnlineStatus(userid, true, false)
	}

	// Broadcast online users list to new connection
	var response Response
	response.Type = "online"
	response.Data = map[string]any{}
	for clientID := range conns {
		response.Data["userID"] = clientID
		conn.WriteJSON(response)
	}
	for {
		var msg Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			break
		}
		msg.Content = html.EscapeString(msg.Content)
		if isValid, err := Checker(db, msg.Token, r); !isValid || err != nil {
			for i, c := range conns[userid] {
				if c == conn {
					conns[userid] = append(conns[userid][:i], conns[userid][i+1:]...)
					break
				}
			}
			if len(conns[userid]) == 0 {
				broadcastOnlineStatus(userid, false, true)
				delete(conns, userid)
			}
			conn.Close()
			break
		}

		msg.Sender, err = getNameByUserid(userid, db)
		if err != nil {
			continue
		}

		receiverID, err := getUseridByName(msg.Receiver, db)
		if err != nil {
			continue
		}

		if msg.Type == "message" {
			saveMessage(msg.Content, userid, receiverID, db)
			response.Type = "message"
		} else {
			response.Type = "typing"
		}
		response.Data = map[string]any{msg.Sender: msg}
		if receiverConns, ok := conns[receiverID]; ok {
			for _, receiverConn := range receiverConns {
				fmt.Println("Sending message to receiver:", msg.Sender, msg.Receiver)
				receiverConn.WriteJSON(msg)
			}
		}
	}
}

func broadcastOnlineStatus(userID int, isOnline, isLogout bool) {
	statusType := "offline"
	if isOnline {
		statusType = "online"
	}

	var response Response
	response.Type = statusType
	response.Data = map[string]any{"userID": userID}
	if isLogout {
		response.Logout = true
	}
	fmt.Println("response 1:", response)
	for clientID, connections := range conns {
		if userID != clientID {
			for _, conn := range connections {
				conn.WriteJSON(response)
			}
		}
	}
}

func saveMessage(msg string, senderID, receiverID int, db *sql.DB) error {
	query := `INSERT INTO chats (sender_id, receiver_id, message) VALUES (?,?,?)`
	_, err := db.Exec(query, senderID, receiverID, msg)
	return err
}

func GetChatHistory(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userid, _ := utils.UserIDFromToken(r, db)
	receiver := r.URL.Query().Get("receiver")

	query := `SELECT sender_id, receiver_id, message, created_at 
			FROM chats 
			WHERE (sender_id = ? AND receiver_id = ?) 
			OR (sender_id = ? AND receiver_id = ?) 
			ORDER BY created_at DESC`
	rows, err := db.Query(query, userid, receiver, receiver, userid)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var messages []Message
	for rows.Next() {
		var msg Message
		if err := rows.Scan(&msg.Sender, &msg.Receiver, &msg.Content, &msg.CreatedAt); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		messages = append(messages, msg)
	}
	json.NewEncoder(w).Encode(messages)
}

func Checker(db *sql.DB, cookie string, r *http.Request) (bool, error) {
	var isValid bool
	query := `SELECT EXISTS(SELECT * FROM sessions WHERE session_id = ?)`
	err := db.QueryRow(query, cookie).Scan(&isValid)
	if err != nil {
		return false, err
	}
	fmt.Println("SELECT cookie : ", cookie)
	fmt.Println("SELECT isValid : ", isValid)

	return isValid, nil
}
