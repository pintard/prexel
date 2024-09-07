package model

import "time"

type PrexelUser struct {
	ID         int64     `json:"id"`
	Email      string    `json:"email" binding:"required"`
	Service    string    `json:"service" binding:"required"`
	Username   string    `json:"username" binding:"required"`
	Contact    string    `json:"contact"`
	ContactURL string    `json:"contact_url"`
	Date       time.Time `json:"date"`
}
