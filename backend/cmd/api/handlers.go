package main

import (
	"net/http"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"todo.umaru.run/internal/models"
)

func handleGetTodos(db *sqlx.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		todos := []models.Todo{}

		err := db.Select(&todos, "SELECT * FROM todos")
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		return c.JSON(http.StatusOK, response{"todos": todos})
	}
}
