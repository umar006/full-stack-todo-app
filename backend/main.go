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
	Id        uuid.UUID `db:"id" json:"id"`
	Todo      string    `db:"todo" json:"todo"`
	Completed bool      `db:"completed" json:"completed"`
}

func main() {
	db, err := sqlx.Connect("postgres", os.Getenv("DB_URL"))
	if err != nil {
		log.Fatalf("error opening database: %w", err)
	}
	err = db.Ping()
	if err != nil {
		log.Fatalf("error connecting to database: %w", err)
	}

	e := echo.New()

	e.GET("/todos", func(c echo.Context) error {
		todos := []Todo{}

		err := db.Select(&todos, "SELECT * FROM todos")
		if err != nil {
			e.Logger.Error(err)
		}

		return c.JSON(http.StatusOK, todos)
	})

	e.POST("/todos", func(c echo.Context) error {
		todo := NewTodo()
		if err := c.Bind(&todo); err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}

		_, err := db.NamedExec("INSERT INTO todos (id, todo) VALUES (:id, :todo)", todo)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		return c.JSON(http.StatusCreated, todo)
	})

	e.Logger.Fatal(e.Start(":9000"))
}

func NewTodo() Todo {
	return Todo{Id: uuid.New()}
}
