package utils

import (
	"database/sql"
	"fmt"

	"prexel-post-api/src/utils/logger"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Connect(host string, port string, user string, password string, dbname string) (err error) {
	var psqlInfo string = fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host,
		port,
		user,
		password,
		dbname)

	DB, err = sql.Open("postgres", psqlInfo)

	if err != nil {
		logger.Log.Error("Error opening database" + err.Error())
	}

	err = DB.Ping()

	return
}
