package handler

import (
	"encoding/json"
	"net/http"
	"prexel-post-api/src/repository"
	"strconv"

	"github.com/gorilla/mux"
)

func GetPostHandler(w http.ResponseWriter, r *http.Request) {
	var vars map[string]string = mux.Vars(r)

	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	post, err := repository.GetPost(id)
	if err != nil {
		http.Error(w, "Failed to find Post by that ID", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(post)
}
