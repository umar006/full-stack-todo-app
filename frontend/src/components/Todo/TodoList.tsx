import {
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { deleteTodo, updateTodo } from "../../services/todoServices";
import type {
  TodoResponse,
  Todo as TodoType,
  TodosResponse,
} from "../../types/todo";
import { Todo } from "./Todo";

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

  const handleEditTodo = (todo: TodoType) => {
    updateMutation.mutate({ ...todo });
  };

  const handleDeleteTodo = (todo: TodoType) => {
    deleteMutation.mutate(todo);
  };

  const inProgressTodoList = () => {
    if (isLoading) return "Loading...";
    if (!data || data.todos.length === 0) return "No todo";

    const todos = [];
    for (let i = 0; i < data.todos.length; i++) {
      const todo = data.todos[i];
      if (!todo || todo.completed) continue;

      todos.push(
        <li
          key={todo.id}
          className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600"
        >
          <Todo
            todo={todo}
            onChange={handleEditTodo}
            onDelete={handleDeleteTodo}
          />
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
          <Todo
            todo={todo}
            onChange={handleEditTodo}
            onDelete={handleDeleteTodo}
          />
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
