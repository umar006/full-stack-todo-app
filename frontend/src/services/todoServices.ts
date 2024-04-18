import { z } from "zod";
import type { DeleteTodo, NewTodo, UpdateTodo } from "../types/todo";

const todosSchema = z.object({
  todos: z.array(
    z.object({
      id: z.string(),
      todo: z.string(),
      completed: z.boolean(),
    }),
  ),
});


export const getTodos = async () => {
  const res = await fetch("https://dummyjson.com/todos");
  const data = todosSchema.parse(await res.json());

  return data;
};

export const createTodo = async (todo: NewTodo) => {
  const res = await fetch("https://dummyjson.com/todos/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      todo: todo.todo,
      completed: false,
      userId: 1,
    }),
  });

  return res.json();
};

export const updateTodo = async (todo: UpdateTodo) => {
  const res = await fetch(`https://dummyjson.com/todos/${todo.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ todo: todo.todo, completed: todo.completed }),
  });
  return res.json();
};

export const deleteTodo = async (todo: DeleteTodo) => {
  const res = await fetch(`https://dummyjson.com/todos/${todo.id}`, {
    method: "DELETE",
  });
  return res.json();
};
