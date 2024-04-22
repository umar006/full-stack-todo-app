package main

import (
	"github.com/jmoiron/sqlx"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"todo.umaru.run/internal/auth"
)

func routes(e *echo.Echo, db *sqlx.DB) {
	todoRoutes := e.Group("/api/todos")
	todoRoutes.Use(echojwt.JWT(auth.JWT_SIGNATURE_KEY))

	todoRoutes.GET("", handleGetTodos(db))
	todoRoutes.POST("", handleCreateTodo(db))
	todoRoutes.PUT("/:todoId", handleUpdateTodo(db))
	todoRoutes.DELETE("/:todoId", handleDeleteTodo(db))

	authRoutes := e.Group("/api/auth")
	authRoutes.POST("/signup", handleSignUp(db))
	authRoutes.POST("/signin", handleSignIn(db))
}
