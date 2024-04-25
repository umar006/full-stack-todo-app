import {
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { deleteTodo, updateTodo } from "../../services/todoServices";
import type { TodoResponse, TodosResponse } from "../../types/todo";

interface TodoListProps {
  queryTodos: UseQueryResult<TodosResponse, Error>;
}

export const TodoList = ({ queryTodos }: TodoListProps) => {
  const { data, isLoading } = queryTodos;

  const queryClient = useQueryClient();

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
      alert(err.message);
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
    onError: (err) => {
      console.error(err);
      alert(err.message);
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
        <li
          key={todo.id}
          className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600"
        >
          <div className="flex flex-row items-center ps-3">
            <input
              id={todo.id}
              type="checkbox"
              checked={todo.completed}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              onChange={() =>
                updateMutation.mutate({ ...todo, completed: true })
              }
            />
            <label
              htmlFor={todo.id}
              data-id={todo.id}
              className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
            >
              {todo?.todo}
            </label>
            <button onClick={handleTodoEdit}>edit</button>
            <button onClick={() => deleteMutation.mutate(todo)}>delete</button>
          </div>
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
        <li
          key={todo.id}
          className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600"
        >
          <div className="flex flex-row items-center ps-3">
            <input
              id={todo.id}
              type="checkbox"
              checked={todo.completed}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              onChange={() =>
                updateMutation.mutate({ ...todo, completed: false })
              }
            />
            <label
              htmlFor={todo.id}
              data-id={todo.id}
              className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
            >
              {todo.todo}
            </label>
            <button onClick={() => deleteMutation.mutate(todo)}>delete</button>
          </div>
        </li>,
      );
    }

    return todos;
  };

  return (
    <>
      <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
        {inProgressTodoList()}
      </ul>
      <h2>Completed TODO</h2>
      <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
        {completedTodoList()}
      </ul>
    </>
  );
};
