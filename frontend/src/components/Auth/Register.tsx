import { useState, type FormEvent } from "react";

export const Register = () => {
  const [show, setShow] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
            <button type="button" onClick={() => setShow((oldVal) => !oldVal)}>
              cancel
            </button>
            <button type="submit">register</button>
          </div>
        </form>
      </>
    );
  };

  return (
    <>
      {!show && (
        <button onClick={() => setShow((oldVal) => !oldVal)}>register</button>
      )}
      {show && registerForm()}
    </>
  );
};
