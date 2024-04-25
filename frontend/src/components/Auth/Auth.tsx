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
    if (token)
      return (
        <div className="text-center my-4">
          <button
            onClick={handleLogout}
            className="font-bold text-center uppercase transition-all text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          >
            logout
          </button>
        </div>
      );

    return (
      <div className="text-center my-4 space-x-4">
        <button
          onClick={() => setShow("login")}
          className="font-bold text-center uppercase transition-all text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
        >
          login
        </button>
        <button
          onClick={() => setShow("register")}
          className="font-bold text-center uppercase transition-all text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
        >
          register
        </button>
      </div>
    );
  };

  return (
    <>
      {authBtn()}
      {show === "login" && <Login />}
      {show === "register" && <Register />}
      {show !== "" && (
        <div className="text-center">
          <button
            onClick={() => setShow("")}
            className="rounded-lg border border-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            cancel
          </button>
        </div>
      )}
    </>
  );
};
