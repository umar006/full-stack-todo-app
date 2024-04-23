package main

import (
	"database/sql"
	"errors"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/lib/pq"

	"todo.umaru.run/internal/auth"
	"todo.umaru.run/internal/models"
)

func handleGetTodos(db *sqlx.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		userId := userIDFromToken(c)

		todos := []models.Todo{}

		err := db.Select(&todos, "SELECT * FROM todos WHERE user_id = $1", userId)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, response{"error": err.Error()})
		}

		return c.JSON(http.StatusOK, response{"todos": todos})
	}
}

func handleCreateTodo(db *sqlx.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		userId := userIDFromToken(c)
		parsedUserId, _ := uuid.Parse(userId)

		todo := models.NewTodo()
		if err := c.Bind(&todo); err != nil {
			return c.JSON(http.StatusBadRequest, response{"error": err.Error()})
		}

		todo.UserID = parsedUserId
		_, err := db.NamedExec("INSERT INTO todos (id, todo, user_id) VALUES (:id, :todo, :user_id)", todo)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, response{"error": err.Error()})
		}

		return c.JSON(http.StatusCreated, response{"todo": todo})
	}
}

func handleUpdateTodo(db *sqlx.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		todoId := c.Param("todoId")
		parsedTodoId, err := uuid.Parse(todoId)
		if err != nil {
			return c.JSON(http.StatusBadRequest, response{"error": "todo not found"})
		}

		userId := userIDFromToken(c)
		parsedUserId, _ := uuid.Parse(userId)

		todo := models.NewTodo()
		todo.Id = parsedTodoId
		todo.UserID = parsedUserId

		if err := c.Bind(&todo); err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}

		_, err = db.NamedExec("UPDATE todos SET todo = :todo, completed = :completed WHERE id = :id AND user_id = :user_id", todo)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, response{"error": err.Error()})
		}

		return c.JSON(http.StatusCreated, response{"todo": todo})
	}
}

func handleDeleteTodo(db *sqlx.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		todoId := c.Param("todoId")
		parsedTodoId, err := uuid.Parse(todoId)
		if err != nil {
			return c.JSON(http.StatusBadRequest, response{"error": "todo not found"})
		}

		userId := userIDFromToken(c)
		parsedUserId, _ := uuid.Parse(userId)

		_, err = db.Exec("DELETE FROM todos WHERE id = $1 AND user_id = $2", parsedTodoId, parsedUserId)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, response{"error": err.Error()})
		}

		return c.NoContent(http.StatusNoContent)
	}
}

func handleSignUp(db *sqlx.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		user := models.User{ID: uuid.New()}
		if err := c.Bind(&user); err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}

		if err := user.Validate(); err != nil {
			return c.JSON(http.StatusBadRequest, response{"error": err.Error()})
		}

		if err := user.HashPassword(); err != nil {
			return c.JSON(http.StatusInternalServerError, response{"error": err.Error()})
		}

		_, err := db.NamedExec("INSERT INTO users (id, username, password) VALUES (:id, :username, :password)", user)
		if err != nil {
			pgErr, ok := err.(*pq.Error)
			if ok {
				if pgErr.Code == "23505" {
					c.JSON(http.StatusUnprocessableEntity, response{"error": "username already exists"})
				}
			}

			return c.JSON(http.StatusInternalServerError, response{"error": err.Error()})
		}

		user.Password = ""
		return c.JSON(http.StatusCreated, response{"user": user})
	}
}

func handleSignIn(db *sqlx.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		user := models.User{}
		if err := c.Bind(&user); err != nil {
			return c.JSON(http.StatusBadRequest, response{"error": err.Error()})
		}

		if err := user.Validate(); err != nil {
			return c.JSON(http.StatusBadRequest, response{"error": err.Error()})
		}

		userFromDb := models.User{}
		err := db.Get(&userFromDb, "SELECT id, username, password FROM users WHERE username = $1", user.Username)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return c.JSON(http.StatusUnauthorized, response{"error": "username or password is wrong"})
			}
			return c.JSON(http.StatusInternalServerError, response{"error": err.Error()})
		}

		if !userFromDb.CheckPasswordHash(user.Password) {
			return c.JSON(http.StatusUnauthorized, response{"error": "username or password is wrong"})
		}

		token, _ := auth.GenerateJwt(userFromDb)

		userFromDb.Password = ""
		return c.JSON(http.StatusCreated, response{"user": userFromDb, "token": token})
	}
}

func userIDFromToken(c echo.Context) string {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	return claims["id"].(string)
}
