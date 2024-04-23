package models

import "github.com/google/uuid"

type Todo struct {
	Id        uuid.UUID `db:"id" json:"id"`
	Todo      string    `db:"todo" json:"todo"`
	Completed bool      `db:"completed" json:"completed"`
	UserID    uuid.UUID `db:"user_id" json:"userId"`
}

func NewTodo() Todo {
	return Todo{Id: uuid.New()}
}
