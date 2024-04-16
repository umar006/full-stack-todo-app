package main

import (
	"log"
	"net/http"
	"os"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	_ "github.com/lib/pq"
)

type Todo struct {
	Id        uuid.UUID `db:"id"`
	Todo      string    `db:"todo"`
	Completed bool      `db:"completed"`
}

func main() {
	db, err := sqlx.Open("postgres", os.Getenv("DB_URL"))
	if err != nil {
		log.Fatalf("error opening database: %w", err)
	}
	err = db.Ping()
	if err != nil {
		log.Fatalf("error connecting to database: %w", err)
	}

	e := echo.New()

	e.GET("/", func(c echo.Context) error { return c.String(http.StatusOK, "Hello, World!") })

	e.Logger.Fatal(e.Start(":9000"))
}
