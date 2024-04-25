import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { register } from "../../services/authServices";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      setUsername("");
      setPassword("");
      alert("success create account");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutation.mutate({ username, password });
  };

  const registerForm = () => {
    return (
      <>
        <h1>REGISTER</h1>
        <form onSubmit={handleRegister}>
          <div>
            <label>
              username:
              <input
                type="text"
                value={username}
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
                className="placeholder:italic placeholder:text-slate-400 block bg-white w-1/4 border border-slate-300 rounded-md py-3 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
              />
            </label>
          </div>
          <div>
            <label>
              password:
              <input
                type="password"
                value={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                className="placeholder:italic placeholder:text-slate-400 block bg-white w-1/4 border border-slate-300 rounded-md py-3 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
              />
            </label>
          </div>
          <div>
            <button type="submit">register</button>
          </div>
        </form>
      </>
    );
  };

  return <>{registerForm()}</>;
};
