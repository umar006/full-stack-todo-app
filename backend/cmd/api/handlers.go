package main

import (
	"net/http"

	"github.com/google/uuid"
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

func handleCreateTodo(db *sqlx.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		todo := models.NewTodo()
		if err := c.Bind(&todo); err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}

		_, err := db.NamedExec("INSERT INTO todos (id, todo) VALUES (:id, :todo)", todo)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		return c.JSON(http.StatusCreated, response{"todo": todo})
	}
}

func handleUpdateTodo(db *sqlx.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		todoId := c.Param("todoId")
		parsedTodoId, err := uuid.Parse(todoId)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "todo not found")
		}

		todo := models.NewTodo()
		todo.Id = parsedTodoId

		if err := c.Bind(&todo); err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}

		_, err = db.NamedExec("UPDATE todos SET todo = :todo, completed = :completed WHERE id = :id", todo)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		return c.JSON(http.StatusCreated, response{"todo": todo})
	}
}

func handleDeleteTodo(db *sqlx.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		todoId := c.Param("todoId")
		parsedTodoId, err := uuid.Parse(todoId)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "todo not found")
		}

		_, err = db.Exec("DELETE FROM todos WHERE id = $1", parsedTodoId)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		return c.NoContent(http.StatusNoContent)
	}
}
