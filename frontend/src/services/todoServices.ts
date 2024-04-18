export const getTodos = async () => {
  const res = await fetch("https://dummyjson.com/todos");
  return res.json();
};
