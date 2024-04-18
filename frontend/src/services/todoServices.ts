import { z } from "zod";
import type { DeleteTodo, NewTodo, UpdateTodo } from "../types/todo";

const BASE_URL = "http://localhost:9000/api/todos";

const todosSchema = z.object({
  todos: z.array(
    z.object({
      id: z.string(),
      todo: z.string(),
      completed: z.boolean(),
    }),
  ),
});

const todoSchema = z.object({
  todo: z.object({
    id: z.string(),
    todo: z.string(),
    completed: z.boolean(),
  }),
});

export const getTodos = async () => {
  const res = await fetch(BASE_URL);
  const data = todosSchema.parse(await res.json());

  return data;
};

export const createTodo = async (todo: NewTodo) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      todo: todo.todo,
      completed: false,
      userId: 1,
    }),
  });
  const data = todoSchema.parse(await res.json());

  return data;
};

export const updateTodo = async (todo: UpdateTodo) => {
  const res = await fetch(`${BASE_URL}/${todo.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ todo: todo.todo, completed: todo.completed }),
  });
  const data = todoSchema.parse(await res.json());

  return data;
};

export const deleteTodo = async (todo: DeleteTodo) => {
  await fetch(`${BASE_URL}/${todo.id}`, {
    method: "DELETE",
  });
};
