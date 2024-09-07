package handler

import (
	"encoding/json"
	"net/http"
	"net/url"
	"prexel-post-api/src/repository"
	"strconv"
)

func GetPostsHandler(w http.ResponseWriter, r *http.Request) {
	var queryValues url.Values = r.URL.Query()
	var lastID *int64

	lastIDStr, ok := queryValues["lastID"]
	if ok && len(lastIDStr) > 0 {
		parsedID, err := strconv.ParseInt(lastIDStr[0], 10, 64)
		if err != nil {
			http.Error(w, "Invalid 'lastID' parameter", http.StatusBadRequest)
			return
		}
		lastID = &parsedID
	}

	limitStr, ok := queryValues["limit"]
	if !ok || len(limitStr) < 1 {
		http.Error(w, "Missing 'limit' parameter", http.StatusBadRequest)
		return
	}

	limit, err := strconv.Atoi(limitStr[0])
	if err != nil {
		http.Error(w, "Invalid 'limit' parameter", http.StatusBadRequest)
		return
	}

	posts, err := repository.PollPosts(lastID, limit)
	if err != nil {
		http.Error(w, "Error retrieving posts", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}
