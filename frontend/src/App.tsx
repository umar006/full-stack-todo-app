import { useQuery } from "@tanstack/react-query";

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
  const { data } = useQuery<TodoResponse | undefined>({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await fetch("https://dummyjson.com/todos");
      return res.json();
    },
  });

  const todoList = () => {
    if (!data || data.todos.length === 0) return "No todo";

    return data.todos.map((todo) => <li key={todo.id}>{todo.todo}</li>);
  };

  return (
    <>
      <h1>TODO</h1>
      <ul>{todoList()}</ul>
    </>
  );
}

export default App;
