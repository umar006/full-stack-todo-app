import type { NewTodo } from "../types/todo";

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
