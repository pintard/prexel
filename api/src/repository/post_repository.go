package repository

import (
	"database/sql"
	"errors"
	"prexel-post-api/src/model"
	"prexel-post-api/src/utils"
	"prexel-post-api/src/utils/logger"
	"strconv"
	"strings"
)

func CreatePost(post model.PrexelPost) (int64, error) {
	logger.Log.Info("Creating post for user ID: " + strconv.FormatInt(post.UserId, 10))

	for i, tag := range post.Tags {
		post.Tags[i] = strings.TrimSpace(strings.ToLower(tag))
	}

	tx, err := utils.DB.Begin()
	if err != nil {
		logger.Log.Error("Failed to begin transaction: " + err.Error())
		return 0, err
	}

	var id int64

	prexelPostQuery := `
		INSERT INTO prexel_posts (user_id, code, title, image_path, create_date, update_date)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id;`

	err = tx.QueryRow(prexelPostQuery, post.UserId, post.Code, post.Title, post.ImagePath, post.CreateDate, post.UpdateDate).Scan(&id)
	if err != nil {
		tx.Rollback()
		logger.Log.Error("Failed to insert post: " + err.Error())
		return 0, err
	}

	for _, tagName := range post.Tags {
		var tagID int64

		err = tx.QueryRow("INSERT INTO prexel_tags (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id;", tagName).Scan(&tagID)
		if err != nil {
			tx.Rollback()
			logger.Log.Error("Failed to insert tag: " + err.Error())
			return 0, err
		}

		_, err = tx.Exec("INSERT INTO prexel_post_tags (post_id, tag_id) VALUES ($1, $2);", id, tagID)
		if err != nil {
			tx.Rollback()
			logger.Log.Error("Failed to insert post tag: " + err.Error())
			return 0, err
		}
	}

	err = tx.Commit()
	if err != nil {
		logger.Log.Error("Failed to commit transaction: " + err.Error())
		return 0, err
	}

	logger.Log.Success("Post created successfully with ID: " + strconv.FormatInt(id, 10))
	return id, nil
}

func GetPost(id int64) (model.PrexelPost, error) {
	var post model.PrexelPost
	query := `SELECT id, user_id, code, create_date, update_date FROM model.PrexelPosts WHERE id=$1;`
	err := utils.DB.QueryRow(query, id).Scan(&post.ID, &post.UserId, &post.Code, &post.CreateDate, &post.UpdateDate)

	if err != nil {
		if err == sql.ErrNoRows {
			return model.PrexelPost{}, errors.New("post not found")
		}
		return model.PrexelPost{}, err
	}

	return post, nil
}

func PollPosts(lastID *int64, limit int) ([]model.PrexelPost, error) {
	var posts []model.PrexelPost
	var query string
	var rows *sql.Rows
	var err error

	if lastID != nil {
		query = `SELECT id, user_id, code, date FROM model.PrexelPosts WHERE id > $1 ORDER BY id ASC LIMIT $2;`
		rows, err = utils.DB.Query(query, *lastID, limit)
	} else {
		query = `SELECT id, user_id, code, date FROM model.PrexelPosts ORDER BY id ASC LIMIT $1;`
		rows, err = utils.DB.Query(query, limit)
	}

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var post model.PrexelPost
		if err := rows.Scan(&post.ID, &post.UserId, &post.Code, &post.Title, post.ImagePath, post.CreateDate, post.UpdateDate); err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}
