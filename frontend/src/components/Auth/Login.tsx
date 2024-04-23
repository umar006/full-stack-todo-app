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
            <button type="submit">login</button>
          </div>
        </form>
      </>
    );
  };

  return <>{loginForm()}</>;
};
