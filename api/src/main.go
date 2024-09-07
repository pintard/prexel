package main

import (
	"net/http"
	"os"
	"os/signal"
	"prexel-post-api/src/handler"
	"prexel-post-api/src/utils"
	"prexel-post-api/src/utils/logger"
	"syscall"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	config, err := utils.LoadConfig()
	if err != nil {
		logger.Log.Error("Error loading configuration: " + err.Error())
		os.Exit(1)
	}

	if err := utils.InitDB(config); err != nil {
		logger.Log.Error("Error initializing the database: " + err.Error())
		os.Exit(1)
	}

	if err := utils.Connect(config.DBHost, config.DBPort, config.DBUser, config.DBPassword, config.DBName); err != nil {
		logger.Log.Error("Error connecting to the database: " + err.Error())
		os.Exit(1)
	}
	defer utils.DB.Close()

	stopChan := make(chan os.Signal, 1)
	signal.Notify(stopChan, os.Interrupt, syscall.SIGTERM)

	router := setupRouter()
	handler := cors.Default().Handler(router)
	serverPort := ":8080"
	server := &http.Server{
		Addr:    serverPort,
		Handler: handler,
	}

	go func() {
		logger.Log.Info("Server is starting and listening on port " + serverPort)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Log.Error("Server failed: " + err.Error())
			stopChan <- syscall.SIGTERM
		}
	}()

	<-stopChan
	logger.Log.Info("Server is shutting down...")

	utils.CleanupDB(config)

	if err := server.Close(); err != nil {
		logger.Log.Error("Server shutdown failed: " + err.Error())
	} else {
		logger.Log.Success("Server successfully stopped")
	}
}

func setupRouter() *mux.Router {
	var router *mux.Router = mux.NewRouter()
	apiRouter := router.PathPrefix("/api/v1").Subrouter()
	apiRouter.HandleFunc("/posts", handler.CreatePostHandler).Methods("POST")
	apiRouter.HandleFunc("/posts", handler.GetPostsHandler).Methods("GET")
	apiRouter.HandleFunc("/posts/{id:[0-9]+}", handler.GetPostHandler).Methods("GET")
	return router
}
