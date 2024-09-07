package utils

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"prexel-post-api/src/utils/logger"
)

func runSQLScript(user, password, dbname, filePath string) error {
	cmd := exec.Command("psql", "-U", user, "-d", dbname, "-f", filePath)
	cmd.Env = append(os.Environ(), fmt.Sprintf("PGPASSWORD=%s", password))
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func InitDB(config *Config) error {
	logger.Log.Info("Initializing the database...")

	wd, err := os.Getwd()
	if err != nil {
		return fmt.Errorf("could not get working directory: %v", err)
	}

	createSQLPath := filepath.Join(wd, "sql", "prexel_database", "create.sql")
	grantSQLPath := filepath.Join(wd, "sql", "prexel_database", "grant.sql")
	adminUser := GetEnv("ADMIN_USER", "postgres")
	adminPassword := GetEnv("ADMIN_PASSWORD", "password")
	adminDBName := GetEnv("ADMIN_DB_NAME", "postgres")

	if err := runSQLScript(adminUser, adminPassword, adminDBName, createSQLPath); err != nil {
		return fmt.Errorf("error creating user or database: %v", err)
	}

	if err := runSQLScript(adminUser, adminPassword, adminDBName, grantSQLPath); err != nil {
		return fmt.Errorf("error granting privileges: %v", err)
	}

	directories := []string{
		"sql/prexel_users",
		"sql/prexel_posts",
		"sql/prexel_tags",
		"sql/prexel_post_tags",
	}

	for _, dir := range directories {
		scriptPath := filepath.Join(wd, dir, "create.sql")
		logger.Log.Info(fmt.Sprintf("Executing script: %s", scriptPath))
		if err := runSQLScript(config.DBUser, config.DBPassword, config.DBName, scriptPath); err != nil {
			return fmt.Errorf("error creating table in directory %s: %v", dir, err)
		}
	}

	logger.Log.Success("Database initialization completed successfully.")
	return nil
}

func CleanupDB(config *Config) {
	logger.Log.Info("Cleaning up the database...")

	wd, err := os.Getwd()
	if err != nil {
		logger.Log.Error(fmt.Sprintf("could not get working directory: %v", err))
		return
	}

	deleteSQLPath := filepath.Join(wd, "sql", "prexel_database", "delete.sql")
	adminUser := GetEnv("ADMIN_USER", "postgres")
	adminPassword := GetEnv("ADMIN_PASSWORD", "password")
	adminDBName := GetEnv("ADMIN_DB_NAME", "postgres")

	if err := runSQLScript(adminUser, adminPassword, adminDBName, deleteSQLPath); err != nil {
		logger.Log.Error(fmt.Sprintf("Error deleting user or database: %v", err))
	} else {
		logger.Log.Success("Database cleanup completed successfully.")
	}
}
