import { useState } from "react";
import { Login } from "./Login";
import { Register } from "./Register";

export const Auth = () => {
  const [show, setShow] = useState("");

  return (
    <>
      <button onClick={() => setShow("login")}>login</button>
      <button onClick={() => setShow("register")}>register</button>
      {show === "login" && <Login />}
      {show === "register" && <Register />}
      {show !== "" && <button onClick={() => setShow("")}>cancel</button>}
    </>
  );
};
