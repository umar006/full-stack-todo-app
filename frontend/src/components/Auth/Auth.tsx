import { useState } from "react";
import { Login } from "./Login";
import { Register } from "./Register";

export const Auth = () => {
  const [show, setShow] = useState("");
  const token = window.localStorage.getItem("token");

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.location.reload();
  };

  const authBtn = () => {
    if (token) return <button onClick={handleLogout}>logout</button>;

    return (
      <>
        <button onClick={() => setShow("login")}>login</button>
        <button onClick={() => setShow("register")}>register</button>
      </>
    );
  };

  return (
    <>
      {authBtn()}
      {show === "login" && <Login />}
      {show === "register" && <Register />}
      {show !== "" && <button onClick={() => setShow("")}>cancel</button>}
    </>
  );
};
