package main

import (
	"log"
	"os"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	_ "github.com/lib/pq"
	"todo.umaru.run/logger"
)

func main() {
	db, err := sqlx.Connect("postgres", os.Getenv("DB_URL"))
	if err != nil {
		log.Fatalf("error opening database: %v", err)
	}
	err = db.Ping()
	if err != nil {
		log.Fatalf("error connecting to database: %v", err)
	}

	e := echo.New()
	e.Pre(middleware.RemoveTrailingSlash())

	e.Use(middleware.CORS())
	e.Use(middleware.RequestID())

	logger := logger.Get()

	e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogURI:       true,
		LogStatus:    true,
		LogMethod:    true,
		LogLatency:   true,
		LogUserAgent: true,
		LogRequestID: true,
		LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
			logger.Info().
				Str("method", v.Method).
				Str("user_agent", v.UserAgent).
				Str("correlation_id", v.RequestID).
				Str("URI", v.URI).
				Int("status_code", v.Status).
				Dur("elapsed_ms", time.Since(v.StartTime)).
				Msg("incoming request")

			return nil
		},
	}))

	routes(e, db)

	e.Logger.Fatal(e.Start(":9000"))
}
