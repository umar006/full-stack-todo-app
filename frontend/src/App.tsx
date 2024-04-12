import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const { data, isLoading } = useQuery<TodoResponse>({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await fetch("https://dummyjson.com/todos");
      return res.json();
    },
  });

  const [todo, setTodo] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("https://dummyjson.com/todos/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          todo: todo,
          completed: false,
          userId: 1,
        }),
      });
      return res.json();
    },
    onSuccess: (data: Todo) => {
      queryClient.setQueryData(["todos"], (oldData: TodoResponse) => {
        return { todos: oldData.todos.concat(data) };
      });
      setTodo("");
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const inProgressTodoList = () => {
    if (isLoading) return "Loading...";
    if (!data || data.todos.length === 0) return "No todo";

    const todos = [];
    for (let i = 0; i < data.todos.length; i++) {
      const todo = data.todos[i];
      if (todo?.completed) continue;

      todos.push(
        <li key={todo?.id}>
          <input type="checkbox" />
          {todo?.todo}
        </li>,
      );
    }

    return todos;
  };

  const completedTodoList = () => {
    if (isLoading) return "Loading...";
    if (!data || data.todos.length === 0) return "No todo";

    const todos = [];
    for (let i = 0; i < data.todos.length; i++) {
      const todo = data.todos[i];
      if (!todo?.completed) continue;

      todos.push(
        <li key={todo?.id}>
          <input type="checkbox" defaultChecked />
          {todo?.todo}
        </li>,
      );
    }

    return todos;
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
      <ul>{inProgressTodoList()}</ul>
      <h2>Completed TODO</h2>
      <ul>{completedTodoList()}</ul>
    </>
  );
}

export default App;
