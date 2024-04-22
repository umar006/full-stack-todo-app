import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Login } from "./components/Auth/Login";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "./services/todoServices";
import type { TodoResponse, TodosResponse } from "./types/todo";

function App() {
  const { data, isLoading } = useQuery<TodosResponse>({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const [todo, setTodo] = useState("");

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: (data: TodoResponse) => {
      queryClient.setQueryData(["todos"], (oldData: TodosResponse) => {
        return { todos: oldData.todos.concat(data.todo) };
      });
      setTodo("");
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: (data: TodoResponse) => {
      queryClient.setQueryData(["todos"], (oldData: TodosResponse) => {
        for (let i = 0; i < oldData.todos.length; i++) {
          if (oldData.todos[i]?.id === data.todo.id)
            oldData.todos[i] = data.todo;
        }
        return { todos: oldData.todos };
      });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: (_: void, deleteTodo) => {
      queryClient.setQueryData(["todos"], (oldData: TodosResponse) => {
        return {
          todos: oldData.todos.filter((todo) => todo.id !== deleteTodo.id),
        };
      });
    },
  });

  const inProgressTodoList = () => {
    if (isLoading) return "Loading...";
    if (!data || data.todos.length === 0) return "No todo";

    const todos = [];
    for (let i = 0; i < data.todos.length; i++) {
      const todo = data.todos[i];
      if (!todo || todo.completed) continue;

      const handleTodoEdit = () => {
        const input = document.createElement("input");
        input.setAttribute("value", todo.todo);

        const todoQuery = document.querySelector(`[data-id="${todo.id}"]`);
        todoQuery?.replaceWith(input);

        const update = () => {
          const span = document.createElement("span");
          span.setAttribute("data-id", String(todo.id));
          span.textContent = input.value;

          updateMutation.mutate({ ...todo, todo: input.value.trim() });

          input.replaceWith(span);
        };

        input.addEventListener("blur", update, { once: true });
        input.setSelectionRange(todo.todo.length, todo.todo.length);
        input.focus();
      };

      todos.push(
        <li key={todo?.id}>
          <input
            type="checkbox"
            onClick={() => updateMutation.mutate({ ...todo, completed: true })}
          />
          <span data-id={todo.id}>{todo?.todo}</span>
          <button onClick={handleTodoEdit}>edit</button>
          <button onClick={() => deleteMutation.mutate(todo)}>delete</button>
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
      if (!todo || !todo.completed) continue;

      todos.push(
        <li key={todo?.id}>
          <input
            type="checkbox"
            onClick={() => updateMutation.mutate({ ...todo, completed: false })}
            defaultChecked
          />
          {todo?.todo}
          <button onClick={() => deleteMutation.mutate(todo)}>delete</button>
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
    createMutation.mutate({ todo: todo });
  };

  return (
    <>
      <Login />
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
