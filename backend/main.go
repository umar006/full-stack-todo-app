package main

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type Todo struct {
	Id        uuid.UUID `db:"id"`
	Todo      string    `db:"todo"`
	Completed bool      `db:"completed"`
}

func main() {
	e := echo.New()

	e.GET("/", func(c echo.Context) error { return c.String(http.StatusOK, "Hello, World!") })

	e.Logger.Fatal(e.Start(":9000"))
}
