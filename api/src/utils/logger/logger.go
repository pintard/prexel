package logger

import (
	"log"
	"sync"

	"github.com/fatih/color"
)

type Logger struct{}

var instance *Logger
var once sync.Once

func GetLoggerInstance() *Logger {
	once.Do(func() {
		instance = &Logger{}
	})
	return instance
}

func (l *Logger) Info(msg string) {
	blue := color.New(color.FgBlue).SprintFunc()
	log.Println(blue("[INFO]"), msg)
}

func (l *Logger) Warning(msg string) {
	yellow := color.New(color.FgYellow).SprintFunc()
	log.Println(yellow("[WARNING]"), msg)
}

func (l *Logger) Error(msg string) {
	red := color.New(color.FgRed).SprintFunc()
	log.Println(red("[ERROR]"), msg)
}

func (l *Logger) Success(msg string) {
	green := color.New(color.FgGreen).SprintFunc()
	log.Println(green("[SUCCESS]"), msg)
}
