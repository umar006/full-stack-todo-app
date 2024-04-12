import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, type ChangeEvent, type FormEvent } from "react";

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

interface TodoResponse {
  todos: Todo[];
}

function App() {
  const { data, isLoading } = useQuery<TodoResponse | undefined>({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await fetch("https://dummyjson.com/todos");
      return res.json();
    },
  });

  const [todo, setTodo] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      await fetch("https://dummyjson.com/todos/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          todo: todo,
          completed: false,
          userId: 1,
        }),
      });
    },
  });

  const todoList = () => {
    if (isLoading) return "Loading...";
    if (!data || data.todos.length === 0) return "No todo";

    return data.todos.map((todo) => <li key={todo.id}>{todo.todo}</li>);
  };

  const handleTodoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value);
  };

  const handleAddTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <>
      <h1>TODO</h1>
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          placeholder="Add new todo.."
          value={todo}
          onChange={handleTodoChange}
        />
        <button type="submit">add</button>
      </form>
      <ul>{todoList()}</ul>
    </>
  );
}

export default App;
