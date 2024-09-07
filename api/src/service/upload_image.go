package service

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"prexel-post-api/src/utils/logger"
)

func UploadImage(file io.Reader, filename string) (string, error) {
	saveDir := "uploads"
	if _, err := os.Stat(saveDir); os.IsNotExist(err) {
		if err := os.MkdirAll(saveDir, os.ModePerm); err != nil {
			logger.Log.Error("Failed to create upload directory: " + err.Error())
			return "", fmt.Errorf("failed to create upload directory: %v", err)
		}
		logger.Log.Info("Created upload directory: " + saveDir)
	}

	filePath := filepath.Join(saveDir, filename)
	dst, err := os.Create(filePath)
	if err != nil {
		logger.Log.Error("Failed to create file: " + err.Error())
		return "", fmt.Errorf("failed to create file: %v", err)
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		logger.Log.Error("Failed to save file: " + err.Error())
		return "", fmt.Errorf("failed to save file: %v", err)
	}

	logger.Log.Info("File uploaded successfully: " + filePath)
	return filePath, nil
}
