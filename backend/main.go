package main

import (
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	_ "github.com/lib/pq"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/pkgerrors"
	"todo.umaru.run/models"
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

	e.Use(middleware.RequestID())

	zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack

	var output io.Writer = zerolog.ConsoleWriter{
		Out:        os.Stdout,
		TimeFormat: time.RFC3339,
	}

	logger := zerolog.New(output).With().Timestamp().Logger()
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

	todoRoutes := e.Group("/api/todos")

	todoRoutes.GET("", func(c echo.Context) error {
		todos := []models.Todo{}

		err := db.Select(&todos, "SELECT * FROM todos")
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		return c.JSON(http.StatusOK, todos)
	})

	todoRoutes.POST("", func(c echo.Context) error {
		todo := models.NewTodo()
		if err := c.Bind(&todo); err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}

		_, err := db.NamedExec("INSERT INTO todos (id, todo) VALUES (:id, :todo)", todo)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		return c.JSON(http.StatusCreated, todo)
	})

	todoRoutes.PUT("/:todoId", func(c echo.Context) error {
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

		return c.JSON(http.StatusCreated, todo)
	})

	todoRoutes.DELETE("/:todoId", func(c echo.Context) error {
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
	})

	e.Logger.Fatal(e.Start(":9000"))
}
