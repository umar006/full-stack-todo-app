package main

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"

	"todo.umaru.run/internal/models"
)

func routes(e *echo.Echo, db *sqlx.DB) {
	todoRoutes := e.Group("/api/todos")
	todoRoutes.GET("", handleGetTodos(db))
	todoRoutes.POST("", handleCreateTodo(db))
	todoRoutes.PUT("/:todoId", handleUpdateTodo(db))
	todoRoutes.DELETE("/:todoId", handleDeleteTodo(db))

	authRoutes := e.Group("/api/auth")
	authRoutes.POST("/signup", func(c echo.Context) error {
		user := models.User{ID: uuid.New()}
		if err := c.Bind(&user); err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}

		_, err := db.NamedExec("INSERT INTO users (id, username, password) VALUES (:id, :username, :password)", user)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		return c.JSON(http.StatusCreated, response{"user": user})
	})
}
