package repository

import (
	"database/sql"
	"errors"
	"prexel-post-api/src/model"
	"prexel-post-api/src/utils"
	"prexel-post-api/src/utils/logger"
)

func CreateUser(user model.PrexelUser) (int64, error) {
	var id int64
	query := `INSERT INTO prexelusers (email, service, username, contact, contact_url, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`
	err := utils.DB.QueryRow(query, user.Email, user.Service, user.Username, user.Contact, user.ContactURL, user.Date).Scan(&id)

	if err != nil {
		return 0, err
	}

	return id, nil
}

func GetUser(id int64) (model.PrexelUser, error) {
	var user model.PrexelUser
	query := `SELECT id, email, service, username, contact, contact_url, date FROM prexelusers WHERE id=$1;`
	err := utils.DB.QueryRow(query, id).Scan(&user.ID, &user.Email, &user.Service, &user.Contact, &user.ContactURL, &user.Date)

	if err != nil {
		if err == sql.ErrNoRows {
			return model.PrexelUser{}, errors.New("user not found")
		}
		return model.PrexelUser{}, err
	}

	return user, nil
}

func UserExists(userID int64) (bool, error) {
	var exists bool
	query := `SELECT EXISTS (SELECT 1 FROM prexel_users WHERE id = $1)`
	err := utils.DB.QueryRow(query, userID).Scan(&exists)
	if err != nil {
		logger.Log.Error("Error checking user existence: " + err.Error())
		return false, err
	}
	return exists, nil
}
