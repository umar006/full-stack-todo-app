import { z } from "zod";
import type { DeleteTodo, NewTodo, UpdateTodo } from "../types/todo";

const BASE_URL = "/api/todos";

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
  const token = window.localStorage.getItem("token");

  const res = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = todosSchema.parse(await res.json());

  return data;
};

export const createTodo = async (todo: NewTodo) => {
  const token = window.localStorage.getItem("token");

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      todo: todo.todo,
      completed: false,
    }),
  });

  if (!res.ok) {
    const error = (await res.json()) as { error: string };
    throw new Error(error.error);
  }

  const data = todoSchema.parse(await res.json());

  return data;
};

export const updateTodo = async (todo: UpdateTodo) => {
  const token = window.localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ todo: todo.todo, completed: todo.completed }),
  });
  const data = todoSchema.parse(await res.json());

  return data;
};

export const deleteTodo = async (todo: DeleteTodo) => {
  const token = window.localStorage.getItem("token");

  await fetch(`${BASE_URL}/${todo.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
