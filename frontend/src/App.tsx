import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Auth } from "./components/Auth/Auth";
import { TodoList } from "./components/Todo/TodoList";
import { createTodo, getTodos } from "./services/todoServices";
import type { TodoResponse, TodosResponse } from "./types/todo";

function App() {
  const data = useQuery<TodosResponse>({
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
      alert(err.message);
    },
  });

  const handleTodoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value);
  };

  const handleAddTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMutation.mutate({ todo: todo });
  };

  return (
    <>
      <Auth />
      <h1>TODO</h1>
      <form onSubmit={handleAddTodo}>
        <input
          className="placeholder:italic placeholder:text-slate-400 block bg-white w-1/4 border border-slate-300 rounded-md py-3 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
          placeholder="Add new todo..."
          type="text"
          value={todo}
          onChange={handleTodoChange}
        />
        <button type="submit">add</button>
      </form>
      <TodoList queryTodos={data} />
    </>
  );
}

export default App;
