package main

import (
	"net/http"

	"github.com/jmoiron/sqlx"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"

	"todo.umaru.run/internal/auth"
)

func routes(e *echo.Echo, db *sqlx.DB) {
	todoRoutes := e.Group("/api/todos")
	todoRoutes.Use(echojwt.WithConfig(echojwt.Config{
		SigningKey: auth.JWT_SIGNATURE_KEY,
		ErrorHandler: func(c echo.Context, err error) error {
			return c.JSON(http.StatusUnauthorized, response{"error": err.Error()})
		},
	}))

	todoRoutes.GET("", handleGetTodos(db))
	todoRoutes.POST("", handleCreateTodo(db))
	todoRoutes.PUT("/:todoId", handleUpdateTodo(db))
	todoRoutes.DELETE("/:todoId", handleDeleteTodo(db))

	authRoutes := e.Group("/api/auth")
	authRoutes.POST("/signup", handleSignUp(db))
	authRoutes.POST("/signin", handleSignIn(db))
}
