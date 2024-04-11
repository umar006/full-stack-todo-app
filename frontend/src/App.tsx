import { useQuery } from "@tanstack/react-query";

function App() {
  const { data } = useQuery({
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
