import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { login } from "../../services/authServices";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      window.localStorage.setItem("token", data.token);

      setUsername("");
      setPassword("");
      alert("success login");

      window.location.reload();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutation.mutate({ username, password });
  };

  const loginForm = () => {
    return (
      <div className="flex flex-col items-center text-center">
        <h1 className="font-semibold text-2xl my-2">LOGIN</h1>
        <form onSubmit={handleLogin}>
          <label>
            <span className="font-semibold">username</span>
            <input
              type="text"
              value={username}
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-3 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
            />
          </label>
          <label>
            <span className="font-semibold">password</span>
            <input
              type="password"
              value={password}
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-3 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
            />
          </label>
          <button
            type="submit"
            className="font-bold text-center uppercase transition-all text-xs my-4 py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          >
            login
          </button>
        </form>
      </div>
    );
  };

  return <>{loginForm()}</>;
};
