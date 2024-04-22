import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import type { RegisterForm } from "../../types/auth";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: async (register: RegisterForm) => {
      const res = await fetch("http://localhost:9000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(register),
      }).then((res) => res.json());

      return res;
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
            <button type="submit">register</button>
          </div>
        </form>
      </>
    );
  };

  return <>{registerForm()}</>;
};
