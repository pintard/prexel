package handler

import (
	"encoding/json"
	"net/http"
	"prexel-post-api/src/model"
	"prexel-post-api/src/repository"
	"prexel-post-api/src/service"
	"prexel-post-api/src/utils/logger"
	"strconv"
	"strings"
	"time"
)

func CreatePostHandler(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		logger.Log.Error("Failed to parse multipart form: " + err.Error())
		http.Error(w, "Failed to parse multipart form", http.StatusBadRequest)
		return
	}

	userId := parseInt64(r.FormValue("user_id"))
	code := r.FormValue("code")
	title := r.FormValue("title")
	tags := r.FormValue("tags")

	userExists, err := repository.UserExists(userId)
	if err != nil {
		logger.Log.Error("Failed to find user: " + err.Error())
		http.Error(w, "Failed to find user", http.StatusInternalServerError)
		return
	}
	if !userExists {
		logger.Log.Error("User does not exist: " + strconv.FormatInt(userId, 10))
		http.Error(w, "User does not exist", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("image")
	if err != nil {
		logger.Log.Error("Failed to get the file: " + err.Error())
		http.Error(w, "Failed to get the file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	imagePath, err := service.UploadImage(file, header.Filename)
	if err != nil {
		logger.Log.Error("Failed to upload image: " + err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	post := model.PrexelPost{
		UserId:     userId,
		Code:       code,
		Title:      title,
		Tags:       strings.Split(tags, ","),
		ImagePath:  imagePath,
		CreateDate: time.Now(),
		UpdateDate: time.Now(),
	}

	id, err := repository.CreatePost(post)
	if err != nil {
		logger.Log.Error("Failed to create post: " + err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	post.ID = id

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(post)
}

func parseInt64(s string) int64 {
	i, err := strconv.ParseInt(s, 10, 64)
	if err != nil {
		logger.Log.Error("Failed to parse int64: " + err.Error())
	}
	return i
}
