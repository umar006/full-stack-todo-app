package logger

import (
	"io"
	"log"
	"os"
	"sync"
	"time"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/pkgerrors"
)

var once sync.Once

var logger zerolog.Logger

func Get() zerolog.Logger {
	once.Do(func() {
		zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack

		var output io.Writer = zerolog.ConsoleWriter{
			Out:        os.Stdout,
			TimeFormat: time.RFC3339,
		}

		if os.Getenv("APP_ENV") != "development" {
			if _, err := os.Stat("logs"); os.IsNotExist(err) {
				err := os.Mkdir("logs", 0700)
				if err != nil {
					log.Fatalf("failed make directory: %v", err)
				}
			}

			file, err := os.OpenFile("./logs/todo.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0664)
			if err != nil {
				log.Fatalf("error opening todo log: %v", err)
			}
			output = zerolog.MultiLevelWriter(os.Stderr, file)
		}

		logger = zerolog.New(output).With().Timestamp().Logger()
	})

	return logger
}
