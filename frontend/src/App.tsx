import { useQuery } from "@tanstack/react-query";

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

function App() {
  const { data } = useQuery<Todo[] | undefined>({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await fetch("https://dummyjson.com/todos");
      return res.json();
    },
  });
  console.log(data);

  return <h1>TODO</h1>;
}

export default App;
