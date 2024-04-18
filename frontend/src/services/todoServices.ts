import type { NewTodo, UpdateTodo } from "../types/todo";

export const getTodos = async () => {
  const res = await fetch("https://dummyjson.com/todos");
  return res.json();
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
