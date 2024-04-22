import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import type { LoginForm } from "../../types/auth";

export const Login = () => {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: async (login: LoginForm) => {
      const res = await fetch("http://localhost:9000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      }).then((res) => res.json());

      return res;
    },
  });

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutation.mutate({ username, password });
  };

  const loginForm = () => {
    return (
      <>
        <h1>LOGIN</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username:
              <input
                type="text"
                value={username}
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
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
              />
            </label>
          </div>
          <div>
            <button type="button" onClick={() => setShow((oldVal) => !oldVal)}>
              cancel
            </button>
            <button type="submit">login</button>
          </div>
        </form>
      </>
    );
  };

  return (
    <>
      {!show && (
        <button onClick={() => setShow((oldVal) => !oldVal)}>login</button>
      )}
      {show && loginForm()}
    </>
  );
};
