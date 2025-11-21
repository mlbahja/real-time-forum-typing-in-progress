package controllers

import (
	"database/sql"
	"fmt"
	"forum/utils"
	"net/http"
)

type usersdata struct {
	User_id  int
	Username string
}

func Existedusers(db *sql.DB, w http.ResponseWriter, r *http.Request) ([]usersdata, error) {
	query := `
	SELECT user_id, username
		FROM users u
		LEFT JOIN chats c
		ON u.user_id = c.sender_id
		OR u.user_id = c.receiver_id
		WHERE u.user_id != ?
		GROUP BY u.user_id
		ORDER BY username ASC
	`
	Owner, err := utils.UserIDFromToken(r, db)
	// Owner := 1
	if err != nil {
		w.WriteHeader(500)
		return nil, fmt.Errorf("failled to get user id %v", err)
	}

	var users []usersdata

	data, err := db.Query(query, Owner)
	if err != nil {
		return nil, fmt.Errorf("failled to execute the query %v", err)
	}
	defer data.Close()

	for data.Next() {
		var user usersdata

		if err := data.Scan(&user.User_id, &user.Username); err != nil {
			return nil, fmt.Errorf("failled to scan the data %v", err)
		}
		users = append(users, user)
	}
	// fmt.Println("users: ", users)

	if err := data.Err(); err != nil {
		return nil, fmt.Errorf("failled to itterat user row %v", err)
	}
	// jsonStr, err := json.Marshal(users)
	// if err != nil {
	// 	return nil, fmt.Errorf("errrror %v ", err)
	// }
	// w.Write(jsonStr)
	return users, nil
}
