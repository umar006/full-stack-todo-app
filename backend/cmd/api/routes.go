package main

import (
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

func routes(e *echo.Echo, db *sqlx.DB) {
	todoRoutes := e.Group("/api/todos")
	todoRoutes.GET("", handleGetTodos(db))
	todoRoutes.POST("", handleCreateTodo(db))
	todoRoutes.PUT("/:todoId", handleUpdateTodo(db))
	todoRoutes.DELETE("/:todoId", handleDeleteTodo(db))

	authRoutes := e.Group("/api/auth")
	authRoutes.POST("/signup", handleSignUp(db))
}
