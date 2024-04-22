import { useState, type FormEvent } from "react";

export const Login = () => {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
